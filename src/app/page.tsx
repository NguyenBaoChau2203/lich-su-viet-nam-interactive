import { InteractiveMapStage } from "@/features/map/InteractiveMapStage";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      {/* Product Introduction Bar with Preview Disclosure */}
      <header className="bg-amber-50/90 border-b border-amber-900/15 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono">
          <span className="bg-stone-900 text-stone-100 px-2 py-0.5 uppercase tracking-wider font-semibold text-[11px]">
            LỊCH SỬ VIỆT NAM · 1945–1975
          </span>
          <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-semibold text-[10px] uppercase">
            BẢN XEM TRƯỚC · DỮ LIỆU ĐANG THẨM TRA
          </span>
        </div>

        <h1 className="font-serif text-xs sm:text-sm font-semibold text-stone-800">
          Khám phá Lịch sử Việt Nam 1945–1975 qua Bản đồ GIS và Diễn biến Tương tác
        </h1>
      </header>

      {/* Interactive Map & Timeline & Battle Stage */}
      <InteractiveMapStage />
    </main>
  );
}
