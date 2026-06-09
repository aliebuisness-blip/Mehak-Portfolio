import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { getWebsiteInfo } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const info = await getWebsiteInfo();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dce8ed_0,#f7f4ee_32%,#f7f4ee_100%)]">
      <SiteHeader name={info.portfolio_name} />
      {children}
      <Footer info={info} />
    </div>
  );
}
