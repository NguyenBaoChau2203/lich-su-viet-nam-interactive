import { describe, expect, it } from "vitest";
import { createLocalityProjectionChannel, localityAnchorFor, localityPresentationBoundsFor } from "@/lib/locality/projection";
import type { LocalityProjection } from "@/lib/explorer/globe-contract";

const projection: LocalityProjection = { code: "01", nonce: 4, point: { x: 240, y: 130 }, bounds: null,
  stageSize: { width: 1100, height: 700 }, offset: { x: 30, y: 60 }, kind: "reference-center" };
describe("locality projection boundary", () => {
  it("reserves the complete measured name label in explorer CSS coordinates without inventing area bounds", () => {
    const labelled = { ...projection, presentationBounds: { left: 190, top: 120, right: 340, bottom: 145 } };
    expect(localityPresentationBoundsFor(labelled, "01", 4)).toEqual({ left: 214, top: 174, right: 376, bottom: 211 });
    expect(localityPresentationBoundsFor(labelled, "01", 5)).toBeNull();
    expect(labelled.bounds).toBeNull();
  });
  it("converts stage CSS coordinates once and rejects stale selection/nonce and occlusion", () => {
    expect(localityAnchorFor(projection, "01", 4)).toEqual({ x: 270, y: 190 });
    expect(localityAnchorFor(projection, "04", 4)).toBeNull();
    expect(localityAnchorFor(projection, "01", 5)).toBeNull();
    expect(localityAnchorFor({ ...projection, point: null }, "01", 4)).toBeNull();
    expect(localityAnchorFor({ ...projection, point: { x: 1200, y: 0 } }, "01", 4)).toBeNull();
    expect(localityAnchorFor({ ...projection, point: { x: NaN, y: 0 } }, "01", 4)).toBeNull();
  });
  it("publishes projection invalidations to the cluster only and removes subscriptions", () => {
    const channel = createLocalityProjectionChannel(); let updates = 0;
    const stop = channel.subscribe(() => updates++);
    channel.publish(projection);
    expect(channel.getSnapshot()).toBe(projection);
    expect(updates).toBe(1);
    channel.publish(projection);
    expect(updates).toBe(1);
    stop(); channel.publish(null);
    expect(channel.getSnapshot()).toBeNull();
    expect(updates).toBe(1);
  });
});
