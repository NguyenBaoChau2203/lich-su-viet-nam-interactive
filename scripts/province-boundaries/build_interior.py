#!/usr/bin/env python3
"""Deterministic offline mutual OSM lines. No polygon reconstruction or source repair."""
import argparse
import gzip
import hashlib
import json
import math
import pathlib
import sys
from collections import defaultdict

import shapely
from shapely.geometry import LineString, Point, shape
from shapely.ops import transform, unary_union
from shapely.strtree import STRtree

RADIUS_M = 6371008.8
COS_ORIGIN = math.cos(math.radians(16))
TOLERANCES = (0, 5, 10, 20, 40, 80)
FILENAME = "history-vietnam-province-boundaries"


def project(lon, lat):
    return RADIUS_M * COS_ORIGIN * math.radians(lon - 108), RADIUS_M * math.radians(lat - 16)


def unproject(x, y):
    return 108 + math.degrees(x / (RADIUS_M * COS_ORIGIN)), 16 + math.degrees(y / RADIUS_M)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def encoded(document):
    return (json.dumps(document, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n").encode("utf-8")


def canonical_coordinates(coords):
    coords = [tuple(p) for p in coords]
    if coords[0] == coords[-1]:
        ring = coords[:-1]
        start = min(range(len(ring)), key=ring.__getitem__)
        forward = ring[start:] + ring[:start]
        reverse = [forward[0]] + list(reversed(forward[1:]))
        best = min(forward, reverse)
        return best + [best[0]]
    return min(coords, list(reversed(coords)))


def canonical_chains(ways, nodes, transition_nodes=()):
    """One undirected graph. Freeze junctions, pair/policy transitions, open endpoints."""
    edges = {}
    adjacency = defaultdict(list)
    pair_adjacency = defaultdict(lambda: defaultdict(list))
    for way in sorted(ways, key=lambda w: w["id"]):
        pair = tuple(sorted(way["provinceCodes"]))
        for a, b in zip(way["nodes"], way["nodes"][1:]):
            key = tuple(sorted((a, b)))
            if a == b or key in edges:
                raise ValueError(f"Duplicate or degenerate source edge: {key}")
            edges[key] = (pair, way["id"])
            for node in key:
                adjacency[node].append(key)
                pair_adjacency[pair][node].append(key)
    transitions = set(transition_nodes)
    used, chains = set(), []
    for pair, neighbours in sorted(pair_adjacency.items()):
        frozen = {n for n, attached in neighbours.items() if len(attached) != 2 or len(adjacency[n]) != 2 or n in transitions}

        def walk(start, first):
            node_ids, way_ids = [start], []
            edge, current = first, start
            while edge not in used:
                used.add(edge)
                way_ids.append(edges[edge][1])
                current = edge[1] if edge[0] == current else edge[0]
                node_ids.append(current)
                if current in frozen or current == start:
                    break
                pending = [e for e in neighbours[current] if e not in used]
                if not pending:
                    break
                edge = min(pending)
            if node_ids[0] > node_ids[-1]:
                node_ids.reverse()
                way_ids.reverse()
            chains.append({"provinceCodes": list(pair), "nodeIds": node_ids, "edgeWayIds": way_ids,
                           "wayIds": sorted(set(way_ids)), "coordinates": [nodes[n] for n in node_ids]})

        for start in sorted(frozen):
            for first in sorted(neighbours[start]):
                if first not in used:
                    walk(start, first)
        # Remaining components are closed loops, with a fixed canonical source node.
        for start in sorted(neighbours):
            for first in sorted(neighbours[start]):
                if first not in used:
                    walk(start, first)
    return sorted(chains, key=lambda c: (c["provinceCodes"], c["nodeIds"]))


def clip_line(line, mask):
    geometry = line.intersection(mask)

    def lines(g):
        if g.is_empty:
            return []
        if g.geom_type == "LineString":
            return [LineString(canonical_coordinates(g.coords))] if g.length > 1e-8 else []
        if hasattr(g, "geoms"):
            return [part for child in g.geoms for part in lines(child)]
        return []

    return sorted(lines(geometry), key=lambda g: list(g.coords))


def source_aware_display_mask(mask, way_lines, reviewed_ids):
    return unary_union([mask] + [way_lines[w].buffer(.03) for w in sorted(reviewed_ids)])


def trace_way_ids(source, part, edge_way_ids):
    """Trace exact subset intervals rather than re-intersect rounded GEOS overlays."""
    start, end = sorted(source.project(Point(p)) for p in (part.coords[0], part.coords[-1]))
    if part.is_ring:
        intervals = [(0, source.length)]
    elif source.is_ring and abs(part.length - (end - start)) > .001:
        intervals = [(0, start), (end, source.length)]
    else:
        intervals = [(start, end)]
    ids, offset = set(), 0
    for a, b, way_id in zip(source.coords, list(source.coords)[1:], edge_way_ids):
        length = math.dist(a, b)
        if any(min(offset + length, high) - max(offset, low) > 1e-7 for low, high in intervals):
            ids.add(way_id)
        offset += length
    return sorted(ids)


def crossing_pairs(lines):
    tree = STRtree(lines)
    for i, line in enumerate(lines):
        for j in sorted(int(k) for k in tree.query(line, predicate="intersects") if k > i):
            yield i, j, line.intersection(lines[j])


def endpoints_cover(line, geometry, epsilon=.001):
    return Point(line.coords[0]).buffer(epsilon).union(Point(line.coords[-1]).buffer(epsilon)).covers(geometry)


def validate_source_network(lines):
    for i, line in enumerate(lines):
        if not line.is_simple or line.length <= 0:
            raise ValueError(f"Source self crossing/degenerate chain {i}")
    for i, j, intersection in crossing_pairs(lines):
        if not endpoints_cover(lines[i], intersection) or not endpoints_cover(lines[j], intersection):
            raise ValueError(f"Unexplained source crossing/overlap {i},{j}: {intersection.wkt[:180]}")


def network_violations(source, candidate, epsilon=.001):
    bad = {i for i, line in enumerate(candidate) if not line.is_simple or line.length <= 0 or (source[i].is_ring and not line.is_ring)}
    for i, j, intersection in crossing_pairs(candidate):
        original = source[i].intersection(source[j])
        if original.is_empty or not original.buffer(epsilon).covers(intersection):
            bad.update((i, j))
    return bad


def simplify_network(source, tolerance):
    validate_source_network(source)
    allowed = [t for t in TOLERANCES if t <= tolerance]
    levels = [len(allowed) - 1] * len(source)
    while True:
        result = [line.simplify(allowed[levels[i]], preserve_topology=True) for i, line in enumerate(source)]
        bad = network_violations(source, result)
        if not bad:
            return result, [allowed[level] for level in levels]
        for i in sorted(bad):
            if levels[i] == 0:
                raise ValueError("Topology fails even at zero simplification tolerance")
            levels[i] -= 1


def safe_output_directory(target, root):
    target, root = pathlib.Path(target).resolve(), pathlib.Path(root).resolve()
    scratch = root / ".task-reports"
    if not target.is_relative_to(scratch) or target == scratch:
        raise ValueError("Candidate output must be a dedicated directory under repository .task-reports/")
    return target


def rendered_segments(features):
    count = 0
    for feature in features:
        points = feature["geometry"]["coordinates"]
        for (lon_a, lat_a), (lon_b, lat_b) in zip(points, points[1:]):
            if abs(lon_a - lon_b) < 1e-7 and abs(lat_a - lat_b) < 1e-7:
                continue
            a, b = math.radians(lat_a), math.radians(lat_b)
            angle = math.degrees(math.acos(max(-1, min(1, math.sin(a) * math.sin(b) + math.cos(a) * math.cos(b) * math.cos(math.radians(lon_a - lon_b))))))
            if angle >= 1e-6:
                count += max(1, math.ceil((angle - 1e-7) / .25))
    return count


def build(args):
    if shapely.__version__ != "2.1.2":
        raise ValueError("Use the pinned offline Shapely 2.1.2 tool")
    root = pathlib.Path(__file__).resolve().parents[2]
    output = safe_output_directory(args.output_dir, root)
    raw = gzip.decompress(args.input.read_bytes())
    source, membership = json.loads(raw), json.loads(args.membership.read_bytes())
    review_bytes = args.source_review.read_bytes()
    review = json.loads(review_bytes)
    audit = review["scopedAudit"]
    if audit["status"] != "pass" or digest(raw) != audit["verifiedHashes"]["rawSha256"]:
        raise ValueError("Source review/input mismatch")
    mask_bytes = args.mask.read_bytes()
    mask_json = json.loads(mask_bytes)
    mask = transform(project, unary_union([shape(f["geometry"]) for f in mask_json["features"]]))
    if not mask.is_valid:
        raise ValueError("Immutable display mask is invalid; do not repair it silently")
    nodes = {n["id"]: project(n["lon"], n["lat"]) for n in source["nodes"]}
    ways = {w["id"]: w for w in source["ways"]}
    eligible = {w["wayId"]: w for w in audit["eligibleWays"]}
    selected = [{**ways[w], "provinceCodes": eligible[w]["provinceCodes"]} for w in sorted(eligible)]
    mask_review = review["displayMaskReview"]
    if mask_review["maskSha256"] != digest(mask_bytes) or mask_review["corridorNumericalHalfWidthM"] != .03:
        raise ValueError("Unreviewed display mask policy")
    channel_ids = {w["wayId"] for w in mask_review["reviewedChannelWays"]}
    if not channel_ids.issubset(eligible):
        raise ValueError("A reviewed channel way is not source-eligible")
    # Preserve exact source river/channel lines between existing national land
    # parts. The 3cm corridor handles GEOS roundoff; it creates no output line.
    # This explicit source-ID review avoids treating every water contact as sea.
    way_lines = {way["id"]: LineString([nodes[n] for n in way["nodes"]]) for way in selected}
    display_mask = source_aware_display_mask(mask, way_lines, channel_ids)
    excluded_nodes = {n for w in source["ways"] if w["id"] not in eligible for n in w["nodes"]}
    chains = canonical_chains(selected, nodes, excluded_nodes)
    source_ends = defaultdict(int)
    for chain in chains:
        if chain["nodeIds"][0] != chain["nodeIds"][-1]:
            for n in (chain["nodeIds"][0], chain["nodeIds"][-1]):
                source_ends[n] += 1
    unaccounted = [n for n, degree in source_ends.items() if degree == 1 and n not in excluded_nodes]
    if unaccounted:
        raise ValueError(f"Unexpected source dangling endpoints: {unaccounted}")

    accounting = []
    for way in selected:
        line = way_lines[way["id"]]
        retained = line.intersection(display_mask).length
        state = "excluded" if retained < 1e-8 else "retained" if display_mask.covers(line) else "clipped"
        accounting.append({"wayId": way["id"], "provinceCodes": way["provinceCodes"], "state": state,
                           "sourceLengthM": round(line.length, 3), "displayLengthM": round(retained, 3),
                           "originalMaskDisplayLengthM": round(line.intersection(mask).length, 3),
                           "reason": "reviewed-source-channel-context" if way["id"] in channel_ids else "inside-immutable-display-context" if state == "retained" else "immutable-national-display-mask"})
    parts, origins = [], []
    for chain in chains:
        original = LineString(chain["coordinates"])
        chain_key = digest(encoded([chain["provinceCodes"], chain["nodeIds"]]))[:16]
        for part_index, part in enumerate(clip_line(original, display_mask)):
            ids = trace_way_ids(original, part, chain["edgeWayIds"])
            if not ids:
                raise ValueError("Clipped line has no traceable source way")
            endpoints = []
            for endpoint in (part.coords[0], part.coords[-1]):
                p = Point(endpoint)
                if p.distance(display_mask.boundary) < .001:
                    endpoints.append("display-mask-intersection")
                elif any(p.distance(Point(nodes[n])) < .001 for n in (chain["nodeIds"][0], chain["nodeIds"][-1])):
                    endpoints.append("frozen-source-endpoint-or-junction")
                else:
                    raise ValueError("Unexplained clipped endpoint")
            origins.append({"id": f"interior-{'-'.join(chain['provinceCodes'])}-{chain_key}-{part_index:03d}",
                            "provinceCodes": chain["provinceCodes"], "sourceEdgeIds": [f"way:{w}" for w in ids],
                            "endpointOrigins": endpoints})
            parts.append(part)
    validate_source_network(parts)
    required_pairs = {tuple(p["provinceCodes"]) for p in audit["pairs"]}
    present_pairs = {tuple(o["provinceCodes"]) for o in origins}
    if required_pairs != present_pairs:
        raise ValueError(f"Source pair loss needs explicit review: {required_pairs - present_pairs}")
    represented_ids = {int(w.split(":")[1]) for o in origins for w in o["sourceEdgeIds"]}
    expected_ids = {a["wayId"] for a in accounting if a["state"] != "excluded"}
    if represented_ids != expected_ids:
        raise ValueError(f"Source trace gap: {sorted(expected_ids - represented_ids)}")
    attempts = []
    for tolerance in TOLERANCES:
        simplified, local_tolerances = simplify_network(parts, tolerance)
        features, rounded_lines = [], []
        for origin, line in zip(origins, simplified):
            coordinates = canonical_coordinates([(round(lon, 7), round(lat, 7)) for lon, lat in (unproject(x, y) for x, y in line.coords)])
            if any(a == b for a, b in zip(coordinates, coordinates[1:])):
                raise ValueError("Coordinate precision collapsed a source segment")
            rounded_lines.append(LineString([project(*p) for p in coordinates]))
            features.append({"type": "Feature", "id": origin["id"], "properties": {"boundaryKind": "province-interior", "provinceCodes": origin["provinceCodes"], "sourceEdgeIds": origin["sourceEdgeIds"]},
                             "geometry": {"type": "LineString", "coordinates": coordinates}})
        if network_violations(parts, rounded_lines, epsilon=.03):
            raise ValueError("Rounding introduced a network crossing")
        displacement = max(a.hausdorff_distance(b) for a, b in zip(parts, rounded_lines))
        if displacement > tolerance + .03:
            raise ValueError("Measured source displacement exceeds tolerance/rounding allowance")
        artifact = {"type": "FeatureCollection", "schemaVersion": 1, "referenceFramework": "VN-34-2025",
                    "sourceTimestamp": source["source"]["timestamp"], "sourceSnapshotSha256": digest(raw),
                    "units": [{"code": u["code"], "name": u["officialName"], "sourceId": str(u["osmRelationId"]), "sourceRevision": str(u["observedRelationVersion"])} for u in sorted(membership["units"], key=lambda u: u["code"])],
                    "license": {"id": "ODbL-1.0", "url": "https://opendatacommons.org/licenses/odbl/1-0/", "attribution": "© OpenStreetMap contributors"},
                    "features": sorted(features, key=lambda f: f["id"])}
        body = encoded(artifact)
        compressed = gzip.compress(body, compresslevel=6, mtime=0)
        segments = sum(len(f["geometry"]["coordinates"]) - 1 for f in features)
        actual_segments = rendered_segments(features)
        metrics = {"toleranceM": tolerance, "bytes": len(body), "gzipBytes": len(compressed), "rawSegments": segments, "subdividedSegments": actual_segments, "maxDisplacementM": round(displacement, 6),
                   "localToleranceFallbacks": sum(t != tolerance for t in local_tolerances)}
        attempts.append(metrics)
        if max(segments, actual_segments) <= 50000 and len(compressed) <= 200 * 1024:
            break
    else:
        raise ValueError(f"No permitted tolerance passes the unchanged budgets: {attempts}")
    accepted_hash = review.get("derivedArtifactSelfReview", {}).get("geojsonSha256")
    if accepted_hash and digest(body) != accepted_hash:
        raise ValueError("Derived geometry differs from the artifact checked in the source self-review; new review required")
    # A conservative local centre-scale bound (latitudes <=24°, plus 5% perspective).
    screen_bound = displacement * (512 * 2**11) / (2 * math.pi * RADIUS_M * math.cos(math.radians(24))) * COS_ORIGIN / math.cos(math.radians(24)) * 1.05
    if screen_bound > 3:
        raise ValueError("Source-relative useful zoom-11 screen-error bound exceeds 3 CSS pixels")
    provenance = {
        "schemaVersion": 1, "scope": "shared-interior-lines", "status": "complete-for-shared-interior-lines", "fullPolygonStatus": "needs_evidence",
        "referenceFramework": "VN-34-2025", "sourceTimestamp": source["source"]["timestamp"],
        "source": {**source["source"], **audit["verifiedHashes"], "datedUrlAvailability": "Publisher may remove dated extracts; no permanent archive asserted"},
        "license": artifact["license"], "copyrightUrl": "https://www.openstreetmap.org/copyright",
        "sourceReview": {"path": "docs/audits/sources/2026-10-25-province-interior-source-review.json", "sha256": digest(review_bytes), "method": review["reviewMethod"]},
        "mask": {"path": "public/maps/vietnam-tabletop.geojson", "sha256": digest(mask_bytes), "meaning": "Immutable display context with explicitly reviewed exact source channel corridors only; does not repair or define administrative geometry", "sourceChannelReview": mask_review},
        "transformation": {"version": 1, "python": sys.version.split()[0], "shapely": shapely.__version__, "geos": shapely.geos_version_string,
                           "projection": {"name": "Spherical equirectangular", "units": "projected metres", "radiusM": RADIUS_M, "originLongitude": 108, "standardParallelLatitude": 16, "originLatitude": 16},
                           "algorithm": "One undirected source-node graph; maximal nonbranching pair chains with frozen junction/policy endpoints; exact national-context intersection; shared-chain Douglas-Peucker with global crossing checks and local smaller-tolerance retry",
                           "toleranceM": tolerance, "coordinateDecimals": 7, "roundingAllowanceM": .03, "gzipLevel": 6, "gzipMtime": 0, "attempts": attempts,
                           "maxSourceRelativeDisplacementM": round(displacement, 6), "conservativeLocalZoom11ErrorCssPx": round(screen_bound, 6),
                           "scriptHashes": {str(p.relative_to(root)).replace("\\", "/"): digest(p.read_bytes()) for p in [pathlib.Path(__file__).resolve(), root / "scripts/build-vietnam-province-boundaries.mjs", root / "scripts/audit-vietnam-province-interior-source.mjs"]}},
        "coverage": {"beforeMask": audit["counts"], "afterMask": {"pairs": [list(p) for p in sorted(present_pairs)], "units": sorted({c for p in present_pairs for c in p}), "waysRepresented": len(represented_ids), "features": len(features), "sourceChains": len(chains)}},
        "policyExclusions": audit["exclusions"], "missingSingleOwnerObjects": audit["missingSingleOwnerObjects"],
        "fullSourceNegativeControl": review["fullSourceNegativeControl"],
        "spatialAccounting": accounting,
        "featureOrigins": origins,
        "topology": {"duplicateSourceEdges": 0, "unexplainedSourceCrossings": 0, "newCrossings": 0, "lostJunctions": 0, "unexplainedDanglingEndpoints": 0,
                     "sourceOpenEndpointsAtExcludedMembership": sorted(n for n, degree in source_ends.items() if degree == 1), "localToleranceFallbacks": metrics["localToleranceFallbacks"]},
        "artifact": {"path": f"/maps/{FILENAME}.geojson", "sha256": digest(body), "gzipSha256": digest(compressed), **metrics},
        "recipe": "node scripts/build-vietnam-province-boundaries.mjs --input .task-reports/explorer-refinement-task-05-work/province-source.run-1.json.gz --membership docs/audits/sources/2026-10-24-vietnam-province-membership.json --mask public/maps/vietnam-tabletop.geojson --source-review docs/audits/sources/2026-10-25-province-interior-source-review.json --output-dir .task-reports/province-boundaries-completion-work/candidate",
        "uncertainty": "Approximate community-source modern reference lines, masked to existing display context. Not legal/cadastral, historical or complete province polygons. Missing single-owner object locations are unknown. Mask clipping is not source reconstruction; full polygons remain needs_evidence.",
    }
    output.mkdir(parents=True, exist_ok=True)
    (output / f"{FILENAME}.geojson").write_bytes(body)
    (output / f"{FILENAME}.geojson.gz").write_bytes(compressed)
    provenance_body = encoded(provenance)
    (output / f"{FILENAME}.provenance.json").write_bytes(provenance_body)
    print(json.dumps({"artifactSha256": digest(body), "provenanceSha256": digest(provenance_body), "metrics": metrics,
                      "coverage": provenance["coverage"], "spatialStates": {state: sum(a["state"] == state for a in accounting) for state in ("retained", "clipped", "excluded")}, "attempts": attempts}))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for flag in ("input", "membership", "mask", "source-review", "output-dir"):
        parser.add_argument(f"--{flag}", required=True, type=pathlib.Path)
    args = parser.parse_args()
    try:
        build(args)
    except (ValueError, KeyError) as error:
        parser.exit(2, f"Interior build rejected: {error}\n")


if __name__ == "__main__":
    main()
