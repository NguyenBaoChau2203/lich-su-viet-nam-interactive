import type { HeritageCover, HeritageTier } from "./types";

export function tierLabel(tier: HeritageTier): string {
  switch (tier) {
    case "grade12":
      return "Lớp 12";
    case "extended":
      return "Mở rộng";
  }
}

export function eraLabel(era: HeritageCover["era"]): string {
  switch (era) {
    case "historical":
      return "Tư liệu lịch sử";
    case "today":
      return "Ảnh ngày nay";
    case "illustration":
      return "Minh họa";
  }
}

export function usageLabel(cover: HeritageCover | null): string {
  if (!cover) return "";
  const credit = cover.credit?.trim() || "";

  switch (cover.usageBasis) {
    case "coursework_reference":
      return credit ? `Tư liệu học tập — ${credit}` : "Tư liệu học tập";
    case "open_license":
      return credit ? `Giấy phép mở — ${credit}` : "Giấy phép mở";
    case "public_domain":
      return credit ? `Phạm vi công cộng — ${credit}` : "Phạm vi công cộng";
    case "permission":
      return credit ? `Được phép sử dụng — ${credit}` : "Được phép sử dụng";
    default:
      return credit;
  }
}

export function videoCountLabel(count: number): string {
  if (count <= 0) return "";
  if (count === 1) return "1 video";
  return `${count} video`;
}
