"use client";

import { CinematicEventMap } from "@/components/explorer/cinematic/CinematicEventMap";
import type { EventMapProps } from "@/lib/explorer/globe-contract";
export type { EventMapProps, GlobeCameraRequest } from "@/lib/explorer/globe-contract";

/** HistoryExplorer dynamically loads this boundary. Only one renderer is mounted. */
export default function EventMap(props: EventMapProps) {
  return <CinematicEventMap {...props} />;
}
