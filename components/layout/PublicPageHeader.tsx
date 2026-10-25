"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";

export function PublicPageHeader() {
  return usePathname() === "/" ? null : <Header />;
}
