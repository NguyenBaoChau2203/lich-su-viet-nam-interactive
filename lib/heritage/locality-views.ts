import { PROVINCES } from "@/lib/provinces";
import type { LocalityCode } from "@/lib/local-heroes/types";
import type { MapView } from "@/lib/explorer/map-view";

export const PROVINCE_NAME_TO_LOCALITY_CODE: Record<string, LocalityCode> = {
  "Hà Nội": "01",
  "Cao Bằng": "04",
  "Tuyên Quang": "08",
  "Điện Biên": "11",
  "Lai Châu": "12",
  "Sơn La": "14",
  "Lào Cai": "15",
  "Thái Nguyên": "19",
  "Lạng Sơn": "20",
  "Quảng Ninh": "22",
  "Bắc Ninh": "24",
  "Phú Thọ": "25",
  "Hải Phòng": "31",
  "Hưng Yên": "33",
  "Ninh Bình": "37",
  "Thanh Hóa": "38",
  "Nghệ An": "40",
  "Hà Tĩnh": "42",
  "Quảng Trị": "44",
  "Huế": "46",
  "Đà Nẵng": "48",
  "Quảng Ngãi": "51",
  "Gia Lai": "52",
  "Khánh Hòa": "56",
  "Đắk Lắk": "66",
  "Lâm Đồng": "68",
  "Đồng Nai": "75",
  "TP. Hồ Chí Minh": "79",
  "Tây Ninh": "80",
  "Đồng Tháp": "82",
  "Vĩnh Long": "86",
  "An Giang": "91",
  "Cần Thơ": "92",
  "Cà Mau": "96",
};

export type LocalityCenter = {
  lat: number;
  lng: number;
  label: string;
};

export const LOCALITY_CENTERS: Record<LocalityCode, LocalityCenter> = (() => {
  const centers: Partial<Record<LocalityCode, LocalityCenter>> = {};

  for (const province of PROVINCES) {
    const code = PROVINCE_NAME_TO_LOCALITY_CODE[province.name];
    if (code) {
      centers[code] = {
        lat: province.lat,
        lng: province.lng,
        label: province.center,
      };
    }
  }

  return centers as Record<LocalityCode, LocalityCenter>;
})();

export function localityFallbackView(code: LocalityCode): MapView {
  const center = LOCALITY_CENTERS[code];
  if (!center) {
    return { lat: 16.0, lng: 107.5, zoom: 7 };
  }
  return {
    lat: center.lat,
    lng: center.lng,
    zoom: 7,
  };
}
