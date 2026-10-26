import * as THREE from "three";
import { groundDisc, mesh, rod, std, type BuiltModel } from "@/components/model3d/kit";

/**
 * Mô hình 3D Dinh Độc Lập (Dinh Thống Nhất) — công trình kiến trúc biểu tượng của KTS Ngô Viết Thụ.
 * Tái hiện 3 tầng lầu, hệ lam "rèm hoa đá" đốt trúc, bãi trực thăng nóc dinh và cột cờ cắm cờ Mặt trận Giải phóng.
 */
export function buildIndependencePalace(): BuiltModel {
  const root = new THREE.Group();

  // Vật liệu
  const concreteWhite = std(0xf3efe6, { rough: 0.75, metal: 0.1 });
  const concreteGrey = std(0xd0ccc2, { rough: 0.8, metal: 0.15 });
  const stoneLamella = std(0xe2ded4, { rough: 0.7, metal: 0.1 });
  const darkTrim = std(0x282c30, { rough: 0.5, metal: 0.7 });
  const darkSteel = std(0x282c30, { rough: 0.5, metal: 0.7 });
  const darkWindow = std(0x182430, { rough: 0.2, metal: 0.9, transparent: true, opacity: 0.85 });
  const redBrick = std(0xaa4433, { rough: 0.9 });
  const yellowPaint = std(0xf4c430, { rough: 0.6 });

  // 1. Thảm cỏ và khuôn viên trước Dinh
  root.add(groundDisc(45, { grass: true }));

  // Đường dạo và thảm cỏ tròn phía trước
  const fountainRing = mesh(new THREE.RingGeometry(2.4, 3.2, 32).rotateX(-Math.PI / 2), concreteGrey, [0, 0.05, 14]);
  root.add(fountainRing);
  const fountainWater = mesh(new THREE.CircleGeometry(2.4, 32).rotateX(-Math.PI / 2), std(0x3a7899, { rough: 0.1, metal: 0.8, transparent: true, opacity: 0.8 }), [0, 0.08, 14]);
  root.add(fountainWater);

  // Đường nhựa dẫn vào sảnh
  const driveway = mesh(new THREE.PlaneGeometry(7.0, 24).rotateX(-Math.PI / 2), std(0x333538, { rough: 0.9 }), [0, 0.02, 12]);
  root.add(driveway);

  // ==========================================
  // 2. KHỐI TÒA NHÀ CHÍNH (MAIN PALACE BUILDING)
  // ==========================================
  // Kích thước mô hình: mặt tiền rộng ~32m, sâu ~18m, cao ~14m
  const palaceGroup = new THREE.Group();
  palaceGroup.position.set(0, 0, -2);

  // Khối đế bệ tầng trệt (Podium)
  palaceGroup.add(mesh(new THREE.BoxGeometry(34, 0.8, 20), concreteGrey, [0, 0.4, 0]));
  // Bậc tam cấp sảnh chính phía trước
  palaceGroup.add(mesh(new THREE.BoxGeometry(10, 0.4, 2.5), concreteGrey, [0, 0.2, 10.5]));

  // Tầng 1 (Trệt): sảnh chính đón khách, cửa kính bao quanh
  palaceGroup.add(mesh(new THREE.BoxGeometry(31.5, 3.6, 17.5), darkWindow, [0, 2.6, 0]));
  // Hàng cột chịu lực tầng 1
  for (let i = -7; i <= 7; i++) {
    const cx = (i / 7) * 15;
    palaceGroup.add(mesh(new THREE.BoxGeometry(0.35, 3.6, 0.35), concreteWhite, [cx, 2.6, 8.8]));
    palaceGroup.add(mesh(new THREE.BoxGeometry(0.35, 3.6, 0.35), concreteWhite, [cx, 2.6, -8.8]));
  }

  // Mái che sảnh đón vươn ra phía trước (Porch canopy)
  palaceGroup.add(mesh(new THREE.BoxGeometry(9.0, 0.35, 4.5), concreteWhite, [0, 4.5, 10.8]));

  // Sàn phân tầng giữa tầng 1 và tầng 2
  palaceGroup.add(mesh(new THREE.BoxGeometry(33, 0.5, 19), concreteWhite, [0, 4.65, 0]));

  // ==========================================
  // 3. TẦNG 2 & 3: MẶT TIỀN "RÈM HOA ĐÁ" (STONE LAMELLAS)
  // ==========================================
  // Tường kính bên trong tầng 2 & 3
  palaceGroup.add(mesh(new THREE.BoxGeometry(31.5, 6.4, 17.5), darkWindow, [0, 8.1, 0]));

  // Sàn ban công đua ra ngoài tầng 2 & 3
  palaceGroup.add(mesh(new THREE.BoxGeometry(32.6, 0.4, 18.6), concreteWhite, [0, 7.8, 0]));
  palaceGroup.add(mesh(new THREE.BoxGeometry(33.0, 0.5, 19.0), concreteWhite, [0, 11.4, 0]));

  // HỆ LAM "RÈM HOA ĐÁ" ĐỐT TRÚC THANH THOÁT
  // Gồm hàng chục thanh lam đứng trang trí mặt tiền phía trước và hai bên hông
  const numLamellas = 34;
  for (let i = 0; i < numLamellas; i++) {
    const lx = -14.8 + (i / (numLamellas - 1)) * 29.6;
    // Bỏ trống khoảng giữa để lộ sảnh ban công danh dự
    if (Math.abs(lx) < 2.2) continue;

    // Tầng 2
    palaceGroup.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.8, 8), stoneLamella, [lx, 6.3, 9.3]));
    // Đốt trúc cách điệu ở giữa thanh lam
    palaceGroup.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8), stoneLamella, [lx, 6.3, 9.3]));

    // Tầng 3
    palaceGroup.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.8, 8), stoneLamella, [lx, 9.7, 9.3]));
    palaceGroup.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8), stoneLamella, [lx, 9.7, 9.3]));
  }

  // Khối ban công danh dự ở tâm tầng 2
  palaceGroup.add(mesh(new THREE.BoxGeometry(4.2, 0.9, 0.8), concreteWhite, [0, 5.4, 9.4]));
  palaceGroup.add(mesh(new THREE.BoxGeometry(4.2, 0.9, 0.8), concreteWhite, [0, 8.8, 9.4]));

  // ==========================================
  // 4. TẦNG THƯỢNG, BÃI TRỰC THĂNG VÀ CỘT CỜ
  // ==========================================
  // Khối nhà lầu trên sân thượng (Tứ Phương Vô Sự lầu / penthouse)
  palaceGroup.add(mesh(new THREE.BoxGeometry(14, 2.8, 10), concreteWhite, [0, 13.0, 0]));
  palaceGroup.add(mesh(new THREE.BoxGeometry(15, 0.4, 11), concreteGrey, [0, 14.6, 0]));

  // Bãi đáp trực thăng tròn màu vàng có chữ "H"
  const helipadCenter: [number, number, number] = [0, 11.66, 2.5];
  // Vòng tròn đáp
  palaceGroup.add(mesh(new THREE.RingGeometry(2.6, 2.85, 32).rotateX(-Math.PI / 2), yellowPaint, helipadCenter));
  // Vạch chữ H ở tâm
  palaceGroup.add(mesh(new THREE.PlaneGeometry(0.35, 2.2).rotateX(-Math.PI / 2), yellowPaint, [helipadCenter[0] - 0.7, helipadCenter[1] + 0.01, helipadCenter[2]]));
  palaceGroup.add(mesh(new THREE.PlaneGeometry(0.35, 2.2).rotateX(-Math.PI / 2), yellowPaint, [helipadCenter[0] + 0.7, helipadCenter[1] + 0.01, helipadCenter[2]]));
  palaceGroup.add(mesh(new THREE.PlaneGeometry(1.4, 0.35).rotateX(-Math.PI / 2), yellowPaint, [helipadCenter[0], helipadCenter[1] + 0.01, helipadCenter[2]]));

  // Điểm đánh dấu hai quả bom phi công Nguyễn Thành Trung ném ngày 8/4/1975
  palaceGroup.add(mesh(new THREE.RingGeometry(0.3, 0.45, 16).rotateX(-Math.PI / 2), redBrick, [-1.8, 11.67, 3.8]));
  palaceGroup.add(mesh(new THREE.RingGeometry(0.3, 0.45, 16).rotateX(-Math.PI / 2), redBrick, [2.1, 11.67, 1.2]));

  // Cột cờ trên nóc Dinh cao vút
  const flagPoleBase: [number, number, number] = [0, 14.8, 0];
  palaceGroup.add(mesh(rod([0, 0, 0], [0, 5.5, 0], 0.06, 12), darkSteel, flagPoleBase));

  // Lá cờ Mặt trận Dân tộc Giải phóng miền Nam (nửa trên đỏ, nửa dưới lam, sao vàng)
  const flagCanvas = document.createElement("canvas");
  flagCanvas.width = 256;
  flagCanvas.height = 170;
  const fctx = flagCanvas.getContext("2d")!;
  fctx.fillStyle = "#da251d";
  fctx.fillRect(0, 0, 256, 85);
  fctx.fillStyle = "#1b6bb5";
  fctx.fillRect(0, 85, 256, 85);
  fctx.fillStyle = "#ffcd00";
  fctx.beginPath();
  const cx = 128;
  const cy = 85;
  const rOuter = 42;
  const rInner = 16;
  for (let i = 0; i < 10; i++) {
    const ang = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    const sx = cx + Math.cos(ang) * r;
    const sy = cy + Math.sin(ang) * r;
    if (i === 0) fctx.moveTo(sx, sy);
    else fctx.lineTo(sx, sy);
  }
  fctx.closePath();
  fctx.fill();

  const flagTex = new THREE.CanvasTexture(flagCanvas);
  flagTex.colorSpace = THREE.SRGBColorSpace;
  const flagMat = new THREE.MeshStandardMaterial({ map: flagTex, roughness: 0.85, side: THREE.DoubleSide });

  const flagGeom = new THREE.PlaneGeometry(2.4, 1.6, 16, 8);
  const flagMesh = mesh(flagGeom, flagMat, [flagPoleBase[0] + 1.2, flagPoleBase[1] + 4.4, flagPoleBase[2]], { rot: [0, 0.3, 0] });
  palaceGroup.add(flagMesh);

  // ==========================================
  // 5. CỔNG CHÍNH VÀ TƯỜNG RÀO HOA SẮT PHÍA TRƯỚC
  // ==========================================
  const gateZ = 22;
  // Hai cột trụ bê tông cổng chính
  for (const gx of [-2.4, 2.4]) {
    palaceGroup.add(mesh(new THREE.BoxGeometry(0.9, 3.2, 0.9), concreteGrey, [gx, 1.6, gateZ]));
    palaceGroup.add(mesh(new THREE.BoxGeometry(1.1, 0.3, 1.1), concreteWhite, [gx, 3.3, gateZ]));
  }
  // Hai cánh cổng sắt mở toang / húc nghiêng
  const gateLeafGeom = new THREE.BoxGeometry(2.1, 2.4, 0.08);
  // Cánh trái húc đổ nghiêng
  palaceGroup.add(mesh(gateLeafGeom, darkTrim, [-1.2, 1.2, gateZ - 0.4], { rot: [0.3, 0.6, 0.2] }));
  // Cánh phải mở toang
  palaceGroup.add(mesh(gateLeafGeom, darkTrim, [1.5, 1.2, gateZ - 0.8], { rot: [0, -1.2, 0] }));

  root.add(palaceGroup);

  return {
    root,
    update: (time: number) => {
      // Lá cờ trên nóc Dinh bay lượn theo gió
      const p = flagGeom.getAttribute("position");
      for (let i = 0; i < p.count; i++) {
        const px = p.getX(i);
        p.setZ(i, Math.sin(px * 3.5 + time * 3.8) * 0.12 * ((px + 1.2) / 2.4));
      }
      p.needsUpdate = true;
    },
  };
}
