import { LOCALITIES } from "./localities";
import type { LocalHeroFilters, LocalityCode } from "./types";

export function normalizeLocalHeroQuery(value: unknown): string {
  if (typeof value !== "string") return "";
  return Array.from(value.replace(/\p{White_Space}+/gu, " ").replace(/[\u0000-\u001f\u007f-\u009f\u200b\ufeff]/gu, "").trim().normalize("NFC")).slice(0, 120).join("");
}

export function foldLocalHeroQuery(value: string): string {
  return normalizeLocalHeroQuery(value).normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[đĐ]/gu, "d").toLocaleLowerCase("vi").replace(/ +/gu, " ");
}

export function normalizeLocalHeroFilters(input: { localityCode?: unknown; query?: unknown; page?: unknown }): LocalHeroFilters {
  const code = LOCALITIES.find((row) => row.code === input.localityCode)?.code ?? null;
  const page = String(input.page ?? "");
  return { localityCode: code as LocalityCode | null, query: normalizeLocalHeroQuery(input.query), page: /^[1-9][0-9]{0,5}$/u.test(page) ? Number(page) : 1 };
}
