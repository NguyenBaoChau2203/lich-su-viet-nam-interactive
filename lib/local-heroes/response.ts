import type { LocalHeroQueryFailure } from "./types";
export const LOCAL_HERO_FAILURE: LocalHeroQueryFailure = { code: "DATA_UNAVAILABLE", message: "Chưa tải được danh sách nhân vật. Vui lòng thử lại.", retryable: true };
