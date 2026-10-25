#!/usr/bin/env python3
"""Extract a pinned OSM research input offline; never emit production geometry.

Run with: uv run --with osmium==4.3.2 python <this script> --input <pbf> --output <research.json.gz>
The known country extract is INCOMPLETE. Use validate-vietnam-province-source.mjs
to expose the absent ways; this extraction is not approval of any province layer.
"""
import argparse
import gzip
import hashlib
import json
import pathlib

import osmium

SOURCE_SHA256 = "c2d0d493638ba152370c89252f9b9a5f0844e7936505f3ab617fadd7023a5c90"
SOURCE_BYTES = 331456690
SOURCE_TIMESTAMP = "2026-10-23T20:20:51Z"
SOURCE_URL = "https://download.geofabrik.de/asia/vietnam-261023.osm.pbf"


def extract(source, target):
    digest = hashlib.sha256()
    with source.open("rb") as stream:
        for chunk in iter(lambda: stream.read(8 * 1024 * 1024), b""):
            digest.update(chunk)
    if source.stat().st_size != SOURCE_BYTES or digest.hexdigest() != SOURCE_SHA256:
        raise ValueError("Unreviewed PBF size/checksum. Do not reuse the crosswalk or force the source gate.")
    reader = osmium.io.Reader(str(source))
    timestamp = reader.header().get("osmosis_replication_timestamp")
    reader.close()
    if timestamp != SOURCE_TIMESTAMP:
        raise ValueError("PBF represented timestamp differs from the pinned research source.")

    relations = []
    national = None
    for relation in osmium.FileProcessor(str(source), osmium.osm.RELATION):
        tags = dict(relation.tags)
        if relation.id == 49915 or (tags.get("boundary") == "administrative" and tags.get("admin_level") == "4" and tags.get("ISO3166-2", "").startswith("VN-")):
            record = {
                "id": relation.id,
                "version": relation.version,
                "timestamp": str(relation.timestamp),
                "tags": tags,
                "members": [{"type": member.type, "ref": member.ref, "role": member.role} for member in relation.members],
            }
            if relation.id == 49915:
                national = record
            else:
                relations.append(record)

    way_ids = {member["ref"] for relation in relations for member in relation["members"] if member["type"] == "w"}
    ways = []
    node_ids = set()
    for way in osmium.FileProcessor(str(source), osmium.osm.WAY).with_filter(osmium.filter.IdFilter(way_ids)):
        refs = [node.ref for node in way.nodes]
        ways.append({"id": way.id, "version": way.version, "timestamp": str(way.timestamp), "tags": dict(way.tags), "nodes": refs})
        node_ids.update(refs)
    nodes = []
    for node in osmium.FileProcessor(str(source), osmium.osm.NODE).with_filter(osmium.filter.IdFilter(node_ids)):
        nodes.append({"id": node.id, "lon": node.lon, "lat": node.lat})

    document = {
        "schemaVersion": 1,
        "source": {"publisher": "OpenStreetMap contributors / Geofabrik GmbH", "url": SOURCE_URL, "timestamp": timestamp, "license": "ODbL-1.0"},
        "national": national,
        "relations": sorted(relations, key=lambda relation: relation["id"]),
        "ways": sorted(ways, key=lambda way: way["id"]),
        "nodes": sorted(nodes, key=lambda node: node["id"]),
    }
    body = json.dumps(document, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    compressed = gzip.compress(body, mtime=0)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(compressed)
    print(json.dumps({
        "status": "research_only_needs_evidence",
        "sourceSha256": SOURCE_SHA256,
        "sourceTimestamp": timestamp,
        "snapshotSha256": hashlib.sha256(body).hexdigest(),
        "snapshotGzipSha256": hashlib.sha256(compressed).hexdigest(),
        "snapshotBytes": len(body),
        "snapshotGzipBytes": len(compressed),
        "relations": len(relations),
        "referencedWays": len(way_ids),
        "availableWays": len(ways),
        "nodes": len(nodes),
    }))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=pathlib.Path)
    parser.add_argument("--output", required=True, type=pathlib.Path)
    args = parser.parse_args()
    public = pathlib.Path(__file__).resolve().parents[1] / "public"
    if args.output.resolve().is_relative_to(public):
        parser.error("Research geometry must remain outside public/. No source geometry has been cleared.")
    if args.input.resolve() == args.output.resolve():
        parser.error("The research output cannot overwrite its source.")
    extract(args.input, args.output)


if __name__ == "__main__":
    main()
