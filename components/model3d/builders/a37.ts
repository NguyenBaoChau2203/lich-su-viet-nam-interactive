import * as THREE from "three";
import { groundDisc, lathe, mesh, rod, std, type BuiltModel } from "@/components/model3d/kit";
import { paintedSteelTexture } from "@/components/model3d/textures";

/**
 * Máy bay phản lực cường kích hạng nhẹ A-37 Dragonfly (Phi đội Quyết thắng).
 * Thiết kế cánh thẳng, thùng nhiên liệu đầu cánh, hai động cơ J85 gắn rễ cánh.
 */
export function buildA37(): BuiltModel {
  const root = new THREE.Group();

  // Vật liệu
  const camoPaint = paintedSteelTexture([0.28, 0.35, 0.22], [4, 4]);
  const olive = std(0xffffff, { map: camoPaint, rough: 0.58, metal: 0.35, bumpScale: 0.3 });
  const darkGrey = std(0x2a2c28, { rough: 0.65, metal: 0.6 });
  const jetBlack = std(0x181a16, { rough: 0.45, metal: 0.85 });
  const canopyGlass = std(0x6688aa, { rough: 0.15, metal: 0.9, transparent: true, opacity: 0.65 });
  const yellowTip = std(0xe5a823, { rough: 0.7 });
  const bombGreen = std(0x384228, { rough: 0.75, metal: 0.3 });

  // Đường băng / sân đỗ bê tông
  root.add(groundDisc(15, { grass: false }));

  // ==========================================
  // 1. THÂN MÁY BAY (FUSELAGE)
  // ==========================================
  const planeGroup = new THREE.Group();
  planeGroup.position.set(0, 1.35, 0);

  // Thân trước vuốt thon khí động học
  const noseProfile: [number, number][] = [
    [0.0, -3.2],
    [0.18, -3.0],
    [0.45, -2.4],
    [0.72, -1.2],
    [0.82, 0.0],
    [0.78, 1.4],
    [0.55, 2.8],
    [0.32, 3.8],
    [0.16, 4.2],
    [0.0, 4.2],
  ];
  const fuselageBody = mesh(lathe(noseProfile, 28).rotateX(Math.PI / 2), olive);
  fuselageBody.scale.set(1.15, 0.9, 1.0);
  planeGroup.add(fuselageBody);

  // Buồng lái 2 chỗ ngồi song song (Side-by-side cockpit canopy)
  const canopyGeom = new THREE.SphereGeometry(0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  canopyGeom.scale(0.9, 0.75, 1.8);
  const canopy = mesh(canopyGeom, canopyGlass, [0, 0.5, -0.6], { rot: [-0.15, 0, 0] });
  planeGroup.add(canopy);

  // Ghế lái và bảng điều khiển bên trong
  for (const seatX of [-0.22, 0.22]) {
    planeGroup.add(mesh(new THREE.BoxGeometry(0.3, 0.55, 0.35), darkGrey, [seatX, 0.25, -0.6]));
    planeGroup.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 12), darkGrey, [seatX, 0.6, -0.6]));
  }

  // Mũi máy bay (Nose cone)
  planeGroup.add(mesh(new THREE.ConeGeometry(0.25, 0.65, 20).rotateX(-Math.PI / 2), jetBlack, [0, -0.05, -3.5]));

  // ==========================================
  // 2. CÁNH THẲNG VÀ THÙNG DẦU ĐẦU MÚT CÁNH (WINGS & TIP TANKS)
  // ==========================================
  // Sải cánh thẳng ~10.9m
  const wingSpan = 4.8; // mỗi bên nửa sải cánh
  for (const side of [-1, 1]) {
    // Cánh máy bay
    const wingGeom = new THREE.BoxGeometry(wingSpan, 0.12, 1.75);
    wingGeom.translate(side * (wingSpan / 2 + 0.5), 0, 0.2);
    planeGroup.add(mesh(wingGeom, olive, [0, 0, 0], { rot: [0, 0, -side * 0.03] }));

    // Cửa hút khí động cơ rễ cánh (Intake)
    planeGroup.add(mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.85, 16).rotateX(Math.PI / 2), darkGrey, [side * 0.95, -0.08, -0.4]));

    // Thùng nhiên liệu phụ đầu mút cánh (Wingtip fuel tank)
    const tankX = side * (wingSpan + 0.55);
    const tipTankGroup = new THREE.Group();
    tipTankGroup.position.set(tankX, 0.02, 0.2);
    // Thân thùng dầu
    tipTankGroup.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 2.6, 20).rotateX(Math.PI / 2), olive));
    // Mũi thùng dầu sơn vàng
    tipTankGroup.add(mesh(new THREE.ConeGeometry(0.22, 0.55, 20).rotateX(-Math.PI / 2), yellowTip, [0, 0, -1.55]));
    // Đuôi thùng dầu vuốt thon
    tipTankGroup.add(mesh(new THREE.ConeGeometry(0.22, 0.5, 20).rotateX(Math.PI / 2), olive, [0, 0, 1.55]));
    planeGroup.add(tipTankGroup);

    // Giá treo vũ khí (Pylons) mang bom dưới cánh
    for (const pylonDist of [1.6, 2.8]) {
      const px = side * pylonDist;
      planeGroup.add(mesh(new THREE.BoxGeometry(0.06, 0.18, 0.7), darkGrey, [px, -0.15, 0.2]));
      // Quả bom công phá dưới giá treo
      const bomb = new THREE.Group();
      bomb.position.set(px, -0.32, 0.2);
      bomb.add(mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.95, 16).rotateX(Math.PI / 2), bombGreen));
      bomb.add(mesh(new THREE.ConeGeometry(0.11, 0.25, 16).rotateX(-Math.PI / 2), yellowTip, [0, 0, -0.6]));
      bomb.add(mesh(new THREE.BoxGeometry(0.24, 0.24, 0.08), darkGrey, [0, 0, 0.5]));
      planeGroup.add(bomb);
    }
  }

  // ==========================================
  // 3. ĐUÔI VÀ ĐỘNG CƠ PHẢN LỰC (TAIL & J85 ENGINES)
  // ==========================================
  // Ống xả 2 động cơ J85 ở phần sau thân
  for (const side of [-1, 1]) {
    planeGroup.add(mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.6, 16).rotateX(Math.PI / 2), jetBlack, [side * 0.45, -0.05, 1.8]));
  }

  // Cánh đuôi đứng (Vertical stabilizer)
  const finOutline: [number, number][] = [
    [0, 0],
    [1.8, 0],
    [1.1, 1.8],
    [0.3, 1.8],
  ];
  const fin = mesh(new THREE.ExtrudeGeometry(new THREE.Shape(finOutline.map(([z, y]) => new THREE.Vector2(z, y))), { depth: 0.1, bevelEnabled: false }).rotateY(Math.PI / 2), olive, [
    -0.05,
    0.35,
    2.2,
  ]);
  planeGroup.add(fin);

  // Cánh đuôi ngang (Horizontal stabilizers)
  for (const side of [-1, 1]) {
    const hStab = mesh(new THREE.BoxGeometry(1.6, 0.06, 0.8), olive, [side * 1.05, 0.4, 3.6], { rot: [0, 0, -side * 0.05] });
    planeGroup.add(hStab);
  }

  // ==========================================
  // 4. CÀNG ĐÁP 3 BÁNH (TRICYCLE LANDING GEAR)
  // ==========================================
  // Càng trước
  planeGroup.add(mesh(rod([0, -0.2, -2.2], [0, -1.15, -2.2], 0.035, 8), darkGrey));
  planeGroup.add(mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16).rotateZ(Math.PI / 2), jetBlack, [0, -1.15, -2.2]));

  // Càng chính hai bên dưới cánh
  for (const side of [-1, 1]) {
    const gx = side * 1.5;
    planeGroup.add(mesh(rod([gx, -0.1, 0.2], [gx, -1.15, 0.2], 0.045, 8), darkGrey));
    planeGroup.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 16).rotateZ(Math.PI / 2), jetBlack, [gx, -1.15, 0.2]));
  }

  root.add(planeGroup);

  return { root };
}
