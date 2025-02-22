import { getCart } from "@/actions/get/carts";
import { getProducts } from "@/actions/get/products";
import { CatalogEmptyState } from "@/components/website/CatalogEmptyState";
import { Pagination } from "@/components/website/Pagination";
import { ProductCard } from "@/components/website/ProductCard";
import { UpsellReviewOverlay } from "@/components/website/UpsellReviewOverlay";
import { capitalizeFirstLetter } from "@/lib/utils/common";
import { cookies } from "next/headers";

export default async function Categories({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const name = (await params).name;
  const page = Number((await searchParams).page) || 1;
  const cookieStore = await cookies();
  const deviceIdentifier = cookieStore.get("device_identifier")?.value || "";
  const cart = await getCart(deviceIdentifier);

  const productFields: (keyof ProductType)[] = [
    "id",
    "name",
    "slug",
    "description",
    "pricing",
    "images",
    "options",
    "upsell",
    "highlights",
  ];

  const allProducts =
    ((await getProducts({
      category: name,
      fields: productFields,
    })) as ProductWithUpsellType[]) || [];

  const itemsPerPage = 2;
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const products = allProducts.slice(startIndex, startIndex + itemsPerPage);

  const displayName = getDisplayName(name);

  if (!products.length) {
    return <CatalogEmptyState />;
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-5 pt-8">
        <div>
          <h2 className="md:w-[calc(100%-20px)] mx-auto mb-4 font-semibold line-clamp-3 md:text-xl">
            {displayName}
          </h2>
          <div>
            <div className="select-none w-full flex flex-wrap gap-2 md:gap-0">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id || index}
                  product={product}
                  cart={cart}
                />
              ))}
            </div>
          </div>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
      <UpsellReviewOverlay cart={cart} />
    </>
  );
}

function getDisplayName(category: string): string {
  switch (category.toLowerCase()) {
    case "men":
      return "Shop Men";
    case "catch-all":
      return "Catch-All";
    default:
      return `Women's ${capitalizeFirstLetter(category)}`;
  }
}
