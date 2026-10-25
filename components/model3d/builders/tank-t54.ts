import * as THREE from "three";
import { extrude, groundDisc, lathe, mesh, rod, std, type BuiltModel, type ModelBuilder } from "@/components/model3d/kit";
import { paintedSteelTexture } from "@/components/model3d/textures";

/**
 * Xe tăng chiến đấu chủ lực T-54 (T-54B) với tháp pháo bán cầu đúc và pháo 100 mm D-10T.
 * Hỗ trợ hai số hiệu lịch sử 843 và 390. Mọi chi tiết dựng thủ tục bằng mã Three.js.
 */
export function tankT54Builder(tankNumber: "843" | "390"): ModelBuilder {
  return (): BuiltModel => {
    const root = new THREE.Group();

    // Vật liệu
    const steelPaint = paintedSteelTexture([0.22, 0.28, 0.16], [3, 3]);
    const olive = std(0xffffff, { map: steelPaint, rough: 0.65, metal: 0.35, bumpScale: 0.3 });
    const oliveDark = std(0x2f3a22, { rough: 0.72, metal: 0.3 });
    const darkSteel = std(0x222420, { rough: 0.45, metal: 0.85 });
    const rubber = std(0x181816, { rough: 0.95 });
    const metalTrim = std(0x1c1e1a, { rough: 0.5, metal: 0.7 });
    const glass = std(0x6688aa, { rough: 0.2, metal: 0.9, transparent: true, opacity: 0.7 });

    // Mặt đất thảm cỏ khuôn viên
    root.add(groundDisc(12, { grass: true }));

    // ==========================================
    // 1. THÂN XE (HULL)
    // ==========================================
    // Khối thân xe chính: dài ~6.2m, rộng ~2.4m, cao ~1.0m (tính từ sàn xe y = 0.65)
    const hullY = 1.05;
    root.add(mesh(new THREE.BoxGeometry(2.35, 0.65, 5.6), olive, [0, hullY, 0]));

    // Giáp trước vát nghiêng 60 độ
    const glacisOutline: [number, number][] = [
      [0, 0],
      [1.1, 0.65],
      [1.1, 0],
    ];
    const frontSloped = mesh(extrude(glacisOutline, 2.35).rotateY(Math.PI / 2), olive, [-1.175, hullY - 0.325, -2.8]);
    root.add(frontSloped);

    // Tấm chắn bùn hai bên (fenders)
    for (const x of [-1.32, 1.32]) {
      root.add(mesh(new THREE.BoxGeometry(0.3, 0.05, 5.8), oliveDark, [x, hullY + 0.1, 0]));
      // Chắn bùn gập phía trước và sau
      root.add(mesh(new THREE.BoxGeometry(0.3, 0.25, 0.04), oliveDark, [x, hullY - 0.02, -2.9]));
      root.add(mesh(new THREE.BoxGeometry(0.3, 0.25, 0.04), oliveDark, [x, hullY - 0.02, 2.9]));
    }

    // Đèn pha trước và còi
    root.add(mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16).rotateX(Math.PI / 2), metalTrim, [-0.8, hullY + 0.38, -2.6]));
    root.add(mesh(new THREE.CircleGeometry(0.08, 16).rotateY(Math.PI), glass, [-0.8, hullY + 0.38, -2.67]));

    // Hai thùng nhiên liệu phụ 200L phía sau đuôi
    for (const x of [-0.62, 0.62]) {
      const drum = mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.85, 20).rotateZ(Math.PI / 2), oliveDark, [x, hullY + 0.35, 2.95]);
      root.add(drum);
      // Đai kim loại kẹp thùng
      for (const dx of [-0.3, 0.3]) {
        root.add(mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 16).rotateZ(Math.PI / 2), metalTrim, [x + dx, hullY + 0.35, 2.95]));
      }
    }

    // Nắp khoang động cơ và lưới tản nhiệt phía sau
    root.add(mesh(new THREE.BoxGeometry(1.6, 0.04, 1.8), metalTrim, [0, hullY + 0.34, 1.6]));

    // ==========================================
    // 2. HỆ THỐNG XÍCH VÀ BÁNH CHỊU NẶNG
    // ==========================================
    // 5 bánh chịu nặng mỗi bên (bán kính 0.40m, khoảng cách bánh 1 và 2 rộng hơn)
    const roadWheelZs = [-1.9, -1.0, -0.15, 0.7, 1.55];
    const wheelY = 0.52;

    const makeTrackSide = (x: number) => {
      const sideGroup = new THREE.Group();
      // Bánh chịu nặng
      for (const z of roadWheelZs) {
        // Lốp cao su viền ngoài
        sideGroup.add(mesh(new THREE.TorusGeometry(0.36, 0.08, 12, 28).rotateY(Math.PI / 2), rubber, [x, wheelY, z]));
        // Vành thép
        sideGroup.add(mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.16, 24).rotateZ(Math.PI / 2), oliveDark, [x, wheelY, z]));
        // May-ơ trục giữa
        sideGroup.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 16).rotateZ(Math.PI / 2), darkSteel, [x, wheelY, z]));
      }

      // Bánh dẫn hướng phía trước
      sideGroup.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.14, 20).rotateZ(Math.PI / 2), darkSteel, [x, wheelY + 0.15, -2.55]));
      // Bánh chủ động phía sau
      sideGroup.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 20).rotateZ(Math.PI / 2), darkSteel, [x, wheelY + 0.15, 2.45]));

      // Dải xích bọc quanh
      const trackWidth = 0.34;
      // Dải xích trên
      sideGroup.add(mesh(new THREE.BoxGeometry(trackWidth, 0.06, 5.1), darkSteel, [x, wheelY + 0.44, -0.05]));
      // Dải xích dưới
      sideGroup.add(mesh(new THREE.BoxGeometry(trackWidth, 0.06, 4.4), darkSteel, [x, wheelY - 0.42, -0.05]));

      return sideGroup;
    };

    root.add(makeTrackSide(-1.32));
    root.add(makeTrackSide(1.32));

    // ==========================================
    // 3. THÁP PHÁO BÁN CẦU (CAST HEMISPHERICAL TURRET)
    // ==========================================
    const turretGroup = new THREE.Group();
    turretGroup.position.set(0, hullY + 0.42, -0.3);

    // Vòm tháp pháo đúc bán cầu đặc trưng của dòng T-54
    const domeProfile: [number, number][] = [
      [0.0, 0.85],
      [0.6, 0.82],
      [1.15, 0.65],
      [1.32, 0.35],
      [1.36, 0.0],
      [0.0, 0.0],
    ];
    const turretDome = mesh(lathe(domeProfile, 32), olive);
    // Hơi kéo dài tháp pháo theo trục z để có hình ô van khí động
    turretDome.scale.set(1.0, 1.0, 1.25);
    turretGroup.add(turretDome);

    // Cửa nóc chỉ huy bên trái
    turretGroup.add(mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.1, 20), oliveDark, [-0.52, 0.88, 0.15]));
    turretGroup.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 20), metalTrim, [-0.52, 0.94, 0.15]));

    // Cửa nóc pháo thủ bên phải
    turretGroup.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 20), oliveDark, [0.52, 0.86, 0.2]));
    turretGroup.add(mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 20), metalTrim, [0.52, 0.91, 0.2]));

    // Ống kính tiềm vọng chỉ huy
    turretGroup.add(mesh(new THREE.BoxGeometry(0.12, 0.14, 0.12), metalTrim, [-0.52, 1.0, -0.1]));

    // Hộp trang bị và tay vịn quanh tháp pháo
    turretGroup.add(mesh(new THREE.BoxGeometry(0.7, 0.22, 0.28), oliveDark, [-0.95, 0.5, 0.4], { rot: [0, 0.3, 0] }));
    turretGroup.add(mesh(new THREE.BoxGeometry(0.7, 0.22, 0.28), oliveDark, [0.95, 0.5, 0.4], { rot: [0, -0.3, 0] }));

    // ==========================================
    // 4. PHÁO CHÍNH 100 MM D-10T
    // ==========================================
    const gunGroup = new THREE.Group();
    gunGroup.position.set(0, 0.45, -1.25);

    // Bệ mặt nạ pháo (mantlet)
    gunGroup.add(mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.55, 20).rotateX(Math.PI / 2), oliveDark, [0, 0, -0.15]));
    // Bạt che bụi chống nước
    gunGroup.add(mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.35, 16).rotateX(Math.PI / 2), metalTrim, [0, 0, -0.45]));

    // Thân nòng pháo dài (khoảng 4.2m)
    const barrelLength = 4.2;
    gunGroup.add(mesh(new THREE.CylinderGeometry(0.085, 0.11, barrelLength, 20).rotateX(Math.PI / 2), darkSteel, [0, 0, -barrelLength / 2 - 0.6]));

    // Bầu hút khói đầu nòng (bore evacuator) đặc trưng T-54B
    gunGroup.add(mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 20).rotateX(Math.PI / 2), darkSteel, [0, 0, -3.9]));

    // Đầu nòng pháo
    gunGroup.add(mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.2, 20).rotateX(Math.PI / 2), darkSteel, [0, 0, -4.7]));

    turretGroup.add(gunGroup);

    // ==========================================
    // 5. SỐ HIỆU XE TĂNG VÀ CỜ MẶT TRẬN GIẢI PHÓNG
    // ==========================================
    // Tạo bảng số hiệu xe tăng 843 hoặc 390 sơn trắng sắc nét trên hai bên tháp pháo
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#2a351d";
    ctx.fillRect(0, 0, 256, 128);
    ctx.font = "bold 96px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tankNumber, 128, 64);
    const numberTexture = new THREE.CanvasTexture(canvas);
    numberTexture.colorSpace = THREE.SRGBColorSpace;
    const numberMat = std(0xffffff, { map: numberTexture, rough: 0.6 });

    // Tấm số hiệu hai bên tháp pháo
    turretGroup.add(mesh(new THREE.PlaneGeometry(0.65, 0.32).rotateY(-Math.PI / 2), numberMat, [-1.22, 0.48, 0], { rot: [0, 0, 0.08] }));
    turretGroup.add(mesh(new THREE.PlaneGeometry(0.65, 0.32).rotateY(Math.PI / 2), numberMat, [1.22, 0.48, 0], { rot: [0, 0, -0.08] }));

    // Cột cờ và cờ Mặt trận Dân tộc Giải phóng miền Nam trên tháp pháo
    const flagPole = mesh(rod([0, 0, 0], [0, 1.8, 0], 0.015, 8), darkSteel, [0.45, 0.85, 0.45]);
    turretGroup.add(flagPole);

    // Lá cờ Mặt trận (nửa trên đỏ, nửa dưới xanh lam, sao vàng)
    const flagCanvas = document.createElement("canvas");
    flagCanvas.width = 256;
    flagCanvas.height = 170;
    const fctx = flagCanvas.getContext("2d")!;
    fctx.fillStyle = "#da251d";
    fctx.fillRect(0, 0, 256, 85);
    fctx.fillStyle = "#1b6bb5";
    fctx.fillRect(0, 85, 256, 85);
    // Ngôi sao vàng
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

    // Lá cờ uốn sóng tự nhiên
    const flagGeom = new THREE.PlaneGeometry(0.9, 0.6, 12, 6);
    const posAttr = flagGeom.getAttribute("position");
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      const wave = Math.sin(px * 6) * 0.06;
      posAttr.setZ(i, wave);
    }
    flagGeom.computeVertexNormals();
    const flagMesh = mesh(flagGeom, flagMat, [0.45 + 0.45, 0.85 + 1.45, 0.45], { rot: [0, 0.2, 0] });
    turretGroup.add(flagMesh);

    root.add(turretGroup);

    return {
      root,
      update: (time: number) => {
        // Cờ bay nhấp nhô nhẹ theo gió
        const p = flagGeom.getAttribute("position");
        for (let i = 0; i < p.count; i++) {
          const px = p.getX(i);
          p.setZ(i, Math.sin(px * 5 + time * 4) * 0.06 * ((px + 0.45) / 0.9));
        }
        p.needsUpdate = true;
      },
    };
  };
}
