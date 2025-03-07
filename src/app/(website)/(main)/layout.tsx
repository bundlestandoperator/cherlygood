import { Footer } from "@/components/website/Footer";
import { MobileNavbarOverlay } from "@/components/website/Navbar/MobileNavbarOverlay";
import { NavbarWrapper } from "@/components/website/Navbar/NavbarWrapper";
import { ProductsProvider } from "@/contexts/ProductsContext";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarWrapper />
      <main className="pt-[65px] md:pt-[57px] min-h-[calc(100vh-328px)]">
        <ProductsProvider>{children}</ProductsProvider>
      </main>
      <Footer />
      <MobileNavbarOverlay />
    </>
  );
}
