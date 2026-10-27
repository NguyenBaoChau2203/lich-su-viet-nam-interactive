import * as THREE from "three";
import { groundDisc, lathe, mesh, rod, std, type BuiltModel } from "@/components/model3d/kit";
import { paintedSteelTexture } from "@/components/model3d/textures";

/**
 * Trực thăng vũ trang / đa năng UH-1 Iroquois (Huey).
 * Cánh quạt chính hai lá, dầm đuôi dài, càng trượt kim loại, cánh quạt quay động học trong update().
 */
export function buildUH1(): BuiltModel {
  const root = new THREE.Group();

  // Vật liệu
  const paint = paintedSteelTexture([0.24, 0.3, 0.2], [4, 4]);
  const olive = std(0xffffff, { map: paint, rough: 0.6, metal: 0.35, bumpScale: 0.3 });
  const darkMetal = std(0x222420, { rough: 0.45, metal: 0.85 });
  const rotorBlack = std(0x181816, { rough: 0.5, metal: 0.6 });
  const glass = std(0x6688aa, { rough: 0.15, metal: 0.9, transparent: true, opacity: 0.7 });
  const yellowTip = std(0xefb025, { rough: 0.65 });

  // Mặt đất sân bay / bãi đáp dã chiến
  root.add(groundDisc(15, { grass: true }));

  const heliGroup = new THREE.Group();
  heliGroup.position.set(0, 1.25, 0);

  // ==========================================
  // 1. KHOANG CABIN CHÍNH (MAIN CABIN)
  // ==========================================
  // Thân trước cabin bo tròn đặc trưng (mũi dạng giọt nước)
  const cabinBody = mesh(new THREE.BoxGeometry(1.8, 1.6, 3.8), olive, [0, 0.25, -0.4]);
  heliGroup.add(cabinBody);

  // Mũi trước vuốt thon cong tròn
  const noseGeom = new THREE.SphereGeometry(0.85, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  noseGeom.scale(1.05, 0.95, 1.6);
  const nose = mesh(noseGeom.rotateX(-Math.PI / 2), olive, [0, 0.25, -2.25]);
  heliGroup.add(nose);

  // Kính buồng lái trước và kính vòm nóc màu xanh (Greenhouse canopy)
  const windshield = mesh(new THREE.BoxGeometry(1.72, 0.85, 1.1), glass, [0, 0.55, -1.8], { rot: [-0.4, 0, 0] });
  heliGroup.add(windshield);
  // Kính trần vòm phía trên
  heliGroup.add(mesh(new THREE.BoxGeometry(1.4, 0.1, 0.8), glass, [0, 1.05, -1.2]));

  // Ghế lái phi công và hoa tiêu
  for (const sx of [-0.45, 0.45]) {
    heliGroup.add(mesh(new THREE.BoxGeometry(0.35, 0.6, 0.35), darkMetal, [sx, 0.15, -1.4]));
  }

  // Cửa lùa khoang chở quân hai bên (Sliding cargo doors)
  for (const side of [-1, 1]) {
    heliGroup.add(mesh(new THREE.BoxGeometry(0.04, 1.25, 1.7), darkMetal, [side * 0.92, 0.2, 0.1]));
    // Băng ghế ngồi dọc trong khoang chở quân
    heliGroup.add(mesh(new THREE.BoxGeometry(0.3, 0.35, 1.5), darkMetal, [side * 0.6, 0.05, 0.1]));
  }

  // Khối nắp động cơ turboshaft trên nóc cabin
  heliGroup.add(mesh(new THREE.CylinderGeometry(0.45, 0.52, 2.2, 16).rotateX(Math.PI / 2), olive, [0, 1.2, 0.1]));
  // Cửa thoát khí ống xả nghiêng
  heliGroup.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.7, 16).rotateX(0.4), darkMetal, [0, 1.25, 1.2]));

  // ==========================================
  // 2. DẦM ĐUÔI VÀ CÁNH QUẠT ĐUÔI (TAIL BOOM & TAIL ROTOR)
  // ==========================================
  // Dầm đuôi vuốt thon dài ~5.2m
  const boomProfile: [number, number][] = [
    [0.45, 0],
    [0.38, 1.5],
    [0.26, 3.2],
    [0.18, 4.8],
    [0.15, 5.4],
  ];
  const tailBoom = mesh(lathe(boomProfile, 20).rotateX(-Math.PI / 2), olive, [0, 0.45, 1.5]);
  heliGroup.add(tailBoom);

  // Cánh đuôi đứng (Vertical fin)
  const fin = mesh(new THREE.BoxGeometry(0.08, 1.4, 0.6), olive, [0, 0.95, 6.7], { rot: [-0.2, 0, 0] });
  heliGroup.add(fin);

  // Cánh thăng bằng ngang trên dầm đuôi (Synchronized elevator)
  for (const side of [-1, 1]) {
    heliGroup.add(mesh(new THREE.BoxGeometry(0.85, 0.04, 0.35), olive, [side * 0.55, 0.45, 4.8]));
  }

  // Cánh quạt đuôi thăng bằng (Tail rotor) ở bên trái cánh đuôi đứng
  const tailRotorGroup = new THREE.Group();
  tailRotorGroup.position.set(-0.12, 1.35, 6.6);

  tailRotorGroup.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12).rotateZ(Math.PI / 2), darkMetal));
  // Hai lá cánh quạt đuôi dài 0.7m mỗi bên
  const trBlade = mesh(new THREE.BoxGeometry(0.02, 1.4, 0.1), rotorBlack);
  tailRotorGroup.add(trBlade);
  // Đầu mút sơn vàng
  for (const ty of [-0.65, 0.65]) {
    tailRotorGroup.add(mesh(new THREE.BoxGeometry(0.022, 0.1, 0.102), yellowTip, [0, ty, 0]));
  }
  heliGroup.add(tailRotorGroup);

  // ==========================================
  // 3. CÀNG HẠ CÁNH DẠNG TRƯỢT (LANDING SKIDS)
  // ==========================================
  const skidRadius = 0.038;
  for (const side of [-1, 1]) {
    const sx = side * 1.05;
    // Thanh trượt dọc dưới đất
    const skidGeom = mesh(rod([sx, -1.18, -2.4], [sx, -1.18, 1.6], skidRadius, 8), darkMetal);
    heliGroup.add(skidGeom);
    // Đầu càng trượt cong vểnh lên phía trước
    heliGroup.add(mesh(rod([sx, -1.18, -2.4], [sx, -0.85, -2.8], skidRadius, 8), darkMetal));

    // Hai chân chống chữ V nối từ thân xe xuống thanh trượt
    heliGroup.add(mesh(rod([side * 0.75, -0.45, -1.1], [sx, -1.18, -1.0], skidRadius, 8), darkMetal));
    heliGroup.add(mesh(rod([side * 0.75, -0.45, 0.7], [sx, -1.18, 0.7], skidRadius, 8), darkMetal));
  }

  // ==========================================
  // 4. CÁNH QUẠT CHÍNH HAI LÁ (MAIN ROTOR)
  // ==========================================
  const mainRotorGroup = new THREE.Group();
  mainRotorGroup.position.set(0, 1.85, -0.2);

  // Trục cánh quạt và đĩa nghiêng (Mast and swashplate)
  mainRotorGroup.add(mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.65, 16), darkMetal, [0, -0.15, 0]));
  mainRotorGroup.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16), darkMetal, [0, 0.05, 0]));
  // Khớp nối hai lá
  mainRotorGroup.add(mesh(new THREE.BoxGeometry(0.6, 0.12, 0.22), darkMetal, [0, 0.2, 0]));

  // Cánh quạt chính 2 lá: đường kính ~14m (bán kính ~6.8m mỗi lá)
  const rotorBladeGeom = new THREE.BoxGeometry(0.3, 0.04, 13.6);
  const rotorBlade = mesh(rotorBladeGeom, rotorBlack, [0, 0.22, 0]);
  mainRotorGroup.add(rotorBlade);

  // Vạch sơn vàng ở hai đầu mút cánh quạt cảnh báo
  for (const rz of [-6.6, 6.6]) {
    mainRotorGroup.add(mesh(new THREE.BoxGeometry(0.305, 0.045, 0.4), yellowTip, [0, 0.22, rz]));
  }

  // Thanh cân bằng phụ (Stabilizer bar) vuông góc với 2 lá chính
  mainRotorGroup.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.8, 8).rotateZ(Math.PI / 2), darkMetal, [0, 0.35, 0]));
  for (const bx of [-1.35, 1.35]) {
    mainRotorGroup.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 12).rotateZ(Math.PI / 2), darkMetal, [bx, 0.35, 0]));
  }

  heliGroup.add(mainRotorGroup);
  root.add(heliGroup);

  return {
    root,
    update: (time: number) => {
      // Cánh quạt chính xoay tròn
      mainRotorGroup.rotation.y = time * 8;
      // Cánh quạt đuôi xoay nhanh hơn
      tailRotorGroup.rotation.x = time * 24;
    },
  };
}
