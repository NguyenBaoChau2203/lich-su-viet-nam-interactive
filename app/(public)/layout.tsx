import { ProgressSync } from "@/components/account/ProgressSync";
import { PublicPageHeader } from "@/components/layout/PublicPageHeader";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { PublicPageTail } from "@/components/layout/PublicPageTail";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#noi-dung-chinh"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Bỏ qua menu, tới nội dung chính
      </a>
      <PublicPageHeader />
      <main id="noi-dung-chinh" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <PublicPageTail>
        <div className="pb-14 md:pb-0 print:pb-0"><Footer /></div>
        <MobileTabBar />
      </PublicPageTail>
      {/* Đồng bộ tiến độ với tài khoản khi đã đăng nhập (client, không làm trang tĩnh thành động). */}
      <ProgressSync />
    </>
  );
}
