"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PublicPageTail({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? null : children;
}
