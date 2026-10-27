import type { ModelBuilder } from "@/components/model3d/kit";
import { buildA1Tunnel } from "@/components/model3d/builders/a1-tunnel";
import { buildA37 } from "@/components/model3d/builders/a37";
import { buildBicycle } from "@/components/model3d/builders/bicycle";
import { bustBuilder } from "@/components/model3d/builders/bust";
import { buildC47 } from "@/components/model3d/builders/c47";
import { buildCommandBunker } from "@/components/model3d/builders/command-bunker";
import { buildHowitzer } from "@/components/model3d/builders/howitzer";
import { buildIndependencePalace } from "@/components/model3d/builders/independence-palace";
import { buildSoldier } from "@/components/model3d/builders/soldier";
import { tankT54Builder } from "@/components/model3d/builders/tank-t54";
import { buildTrenches } from "@/components/model3d/builders/trenches";
import { buildUH1 } from "@/components/model3d/builders/uh1";
import { buildValley } from "@/components/model3d/builders/valley";

/** Bộ dựng của từng mô hình theo id (khớp `lib/models3d/specs.ts`). Nạp muộn: chỉ khi người xem bấm xem. */
export const builders: Record<string, ModelBuilder> = {
  "luu-phao-105": buildHowitzer,
  "xe-dap-tho": buildBicycle,
  "may-bay-c47": buildC47,
  "chien-si": buildSoldier,
  "ham-de-castries": buildCommandBunker,
  "duong-ham-a1": buildA1Tunnel,
  "chien-hao-a1": buildTrenches,
  "sa-ban-chien-thang": buildValley,
  "tuong-vo-nguyen-giap": bustBuilder({ name: "Võ Nguyên Giáp", role: "Đại tướng, Chỉ huy trưởng chiến dịch", hat: "helmet", epaulettes: true }),
  "tuong-de-castries": bustBuilder({ name: "Christian de Castries", role: "Chỉ huy tập đoàn cứ điểm của Pháp", hat: "kepi", epaulettes: true }),
  "tuong-phan-dinh-giot": bustBuilder({ name: "Phan Đình Giót", role: "Anh hùng LLVTND", hat: "floppy", epaulettes: false }),
  "tuong-to-vinh-dien": bustBuilder({ name: "Tô Vĩnh Diện", role: "Anh hùng LLVTND", hat: "floppy", epaulettes: false }),
  "xe-tang-t54-843": tankT54Builder("843"),
  "xe-tang-t54-390": tankT54Builder("390"),
  "dinh-doc-lap": buildIndependencePalace,
  "may-bay-a37": buildA37,
  "truc-thang-uh1": buildUH1,
};
