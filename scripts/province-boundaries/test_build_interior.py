"""Synthetic topology tests only; these coordinates never enter public data."""
import importlib.util
import pathlib
import unittest

from shapely.geometry import LineString, Polygon, box

MODULE = pathlib.Path(__file__).with_name("build_interior.py")


class InteriorBuilderTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location("build_interior", MODULE)
        cls.builder = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.builder)

    def test_shared_edge_once_and_reordered_input_determinism(self):
        nodes = {1: (0, 0), 2: (1, 0), 3: (2, 0), 4: (4, 0), 5: (5, 0)}
        ways = [{"id": 20, "nodes": [2, 3], "provinceCodes": ["01", "04"]},
                {"id": 10, "nodes": [2, 1], "provinceCodes": ["01", "04"]},
                {"id": 30, "nodes": [4, 5], "provinceCodes": ["01", "04"]}]
        result = self.builder.canonical_chains(ways, nodes)
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["nodeIds"], [1, 2, 3])
        self.assertEqual(sum(len(c["nodeIds"]) - 1 for c in result), 3)
        self.assertEqual(result, self.builder.canonical_chains(list(reversed(ways)), dict(reversed(list(nodes.items())))))

    def test_triple_junction_is_frozen_for_all_pairs(self):
        nodes = {1: (0, 0), 2: (1, 0), 3: (0, 1), 4: (-1, 0)}
        ways = [{"id": i + 1, "nodes": [1, i + 2], "provinceCodes": pair}
                for i, pair in enumerate([["01", "04"], ["01", "08"], ["04", "08"]])]
        chains = self.builder.canonical_chains(ways, nodes)
        self.assertEqual(len(chains), 3)
        self.assertTrue(all(1 in [c["nodeIds"][0], c["nodeIds"][-1]] for c in chains))

    def test_closed_loop_keeps_closure_and_nonzero_area(self):
        nodes = {1: (0, 0), 2: (10, 0), 3: (10, 10), 4: (0, 10)}
        chains = self.builder.canonical_chains([{"id": 1, "nodes": [3, 4, 1, 2, 3], "provinceCodes": ["01", "04"]}], nodes)
        self.assertEqual(chains[0]["nodeIds"][0], chains[0]["nodeIds"][-1])
        simplified, _ = self.builder.simplify_network([LineString(chains[0]["coordinates"])], 80)
        self.assertTrue(simplified[0].is_ring)
        self.assertGreater(Polygon(simplified[0]).area, 0)

    def test_reversed_duplicate_source_edge_fails(self):
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            self.builder.canonical_chains([
                {"id": 1, "nodes": [1, 2], "provinceCodes": ["01", "04"]},
                {"id": 2, "nodes": [2, 1], "provinceCodes": ["04", "08"]}], {1: (0, 0), 2: (1, 0)})

    def test_clip_preserves_disconnected_parts_and_holes_without_connecting_them(self):
        mask = Polygon([(0, 0), (10, 0), (10, 10), (0, 10)], holes=[[(4, 4), (6, 4), (6, 6), (4, 6)]])
        parts = self.builder.clip_line(LineString([(-1, 5), (11, 5)]), mask)
        self.assertEqual([round(p.length) for p in parts], [4, 4])
        self.assertTrue(all(mask.covers(p) for p in parts))
        self.assertEqual(self.builder.clip_line(LineString([(-2, -2), (-1, -1)]), mask), [])

    def test_new_crossing_retries_smaller_tolerance_without_deleting_line(self):
        # Simplifying the inverted V to its baseline would cross the short vertical.
        source = [LineString([(-10, 0), (0, 10), (10, 0)]), LineString([(0, -2), (0, 2)])]
        simplified, tolerances = self.builder.simplify_network(source, 20)
        self.assertFalse(simplified[0].intersects(simplified[1]))
        self.assertEqual(len(simplified), 2)
        self.assertLess(tolerances[0], 20)

    def test_unexplained_source_crossing_fails(self):
        with self.assertRaisesRegex(ValueError, "source.*cross|Source.*cross"):
            self.builder.simplify_network([LineString([(-1, 0), (1, 0)]), LineString([(0, -1), (0, 1)])], 5)

    def test_projection_round_trip_uses_projected_metres(self):
        projected = self.builder.project(108, 16)
        self.assertEqual(projected, (0, 0))
        x, y = self.builder.project(108.001, 16)
        self.assertGreater(x, 100)
        self.assertLess(x, 110)
        self.assertEqual(y, 0)
        lon, lat = self.builder.unproject(x, y)
        self.assertAlmostEqual(lon, 108.001)
        self.assertAlmostEqual(lat, 16)

    def test_unsafe_output_cannot_overwrite_public_or_source(self):
        root = pathlib.Path(__file__).resolve().parents[2]
        for target in [root, root / "public/maps", root.parent / "outside", root / "scripts"]:
            with self.subTest(target=target), self.assertRaises(ValueError):
                self.builder.safe_output_directory(target, root)
        self.builder.safe_output_directory(root / ".task-reports/test-candidate", root)

    def test_endpoint_preservation_in_simplification(self):
        source = LineString([(0, 0), (2, .1), (4, 0)])
        simplified, _ = self.builder.simplify_network([source], 5)
        self.assertEqual(list(simplified[0].coords), [(0, 0), (4, 0)])
        self.assertLessEqual(source.hausdorff_distance(simplified[0]), 5)

    def test_trace_ids_use_source_arclength_despite_overlay_roundoff(self):
        source = LineString([(0, 0), (1, .3), (2, 0)])
        part = source.intersection(box(.25, -1, 1.75, 1))
        self.assertEqual(self.builder.trace_way_ids(source, part, [10, 20]), [10, 20])
        first = source.intersection(box(.25, -1, .75, 1))
        self.assertEqual(self.builder.trace_way_ids(source, first, [10, 20]), [10])

    def test_trace_closed_loop_retains_last_edge_at_canonical_seam(self):
        source = LineString([(0, 0), (10, 0), (10, 10), (0, 0)])
        self.assertEqual(self.builder.trace_way_ids(source, source, [10, 20, 30]), [10, 20, 30])
        part = LineString([(5, 5), (0, 0)])
        self.assertEqual(self.builder.trace_way_ids(source, part, [10, 20, 30]), [30])

    def test_reviewed_channel_preserves_source_between_banks_without_open_sea_extension(self):
        land = box(0, 0, 4, 10).union(box(6, 0, 10, 10))
        channel = LineString([(5, 2), (5, 8)])
        open_sea = LineString([(5, -5), (5, -1)])
        self.assertEqual(self.builder.clip_line(channel, land), [])
        display = self.builder.source_aware_display_mask(land, {7: channel, 8: open_sea}, [7])
        self.assertTrue(display.covers(channel))
        self.assertEqual(self.builder.clip_line(open_sea, display), [])
        self.assertTrue(land.equals(box(0, 0, 4, 10).union(box(6, 0, 10, 10))))


if __name__ == "__main__":
    unittest.main()
