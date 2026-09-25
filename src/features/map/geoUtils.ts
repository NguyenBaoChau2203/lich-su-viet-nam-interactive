/**
 * Tiện ích chuyển đổi tọa độ địa lý (GPS: Latitude, Longitude) sang hệ tọa độ SVG Vector Canvas.
 * Chuẩn hóa theo khung lãnh thổ Việt Nam và các quần đảo chủ quyền (Hoàng Sa, Trường Sa).
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface GeoBoundingBox {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
  svgWidth: number;
  svgHeight: number;
}

/**
 * Khung tọa độ địa lý chuẩn của Việt Nam
 * Kinh độ từ ~101.5°E (Điện Biên) đến 110.5°E (đất liền) và vươn ra Biển Đông
 * Vĩ độ từ 8.0°N (Cà Mau) đến 24.0°N (Hà Giang)
 * SVG Canvas viewBox chuẩn: (0, 0, 1000, 1200)
 */
export const GEO_BOUNDS: GeoBoundingBox = {
  minLng: 101.5,
  maxLng: 110.5,
  minLat: 8.0,
  maxLat: 24.0,
  svgWidth: 1000,
  svgHeight: 1200,
};

/**
 * Chuyển đổi vĩ độ (lat) và kinh độ (lng) sang tọa độ x, y trên SVG.
 * Chú ý: Trục Y trên SVG hướng từ trên xuống dưới, nên vĩ độ càng cao (phía Bắc) thì Y càng nhỏ.
 */
export function geoToSvg(lat: number, lng: number, bounds: GeoBoundingBox = GEO_BOUNDS): Point2D {
  const clampedLng = Math.max(bounds.minLng, Math.min(bounds.maxLng, lng));
  const clampedLat = Math.max(bounds.minLat, Math.min(bounds.maxLat, lat));

  const x = ((clampedLng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * bounds.svgWidth;
  const y = ((bounds.maxLat - clampedLat) / (bounds.maxLat - bounds.minLat)) * bounds.svgHeight;

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}
