import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type ShopProduct = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  product_type: "physical" | "digital" | "affiliate";
  category: string;
  subcategory: string;
  thumbnail_url: string;
  original_price: number;
  discounted_price: number | null;
  currency: string;
  rating: number;
  reviews_count: number;
  purchases_count: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  tags: string[];
  demo_url: string | null;
};

function formatPrice(price: number | null, currency: string): string {
  if (!price) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(price);
}

function calculateDiscount(original: number, discounted: number | null): number {
  if (!discounted) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

export default async function ShopPage() {
  const supabase = await createClient();

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("shop_products")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(4);

  // Fetch all published products
  const { data: allProducts } = await supabase
    .from("shop_products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  // Group products by category
  const productsByCategory: Record<string, ShopProduct[]> = allProducts?.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, ShopProduct[]>) ?? {};

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-linear-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-linear-to-br from-purple-400/20 to-pink-400/20 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
              <span className="text-2xl">🛍️</span>
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Premium Digital Products & Tools
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
                Developer Shop
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Premium templates, components, tools, and curated products to supercharge your development workflow. 
              Save weeks of development time!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#featured"
                className="px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
              >
                Browse Products
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
              >
                Custom Solutions
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                  {allProducts?.length || 0}+
                </div>
                <div className="text-sm text-gray-600 mt-1">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
                  {allProducts?.reduce((sum, p) => sum + (p.purchases_count || 0), 0) || 0}+
                </div>
                <div className="text-sm text-gray-600 mt-1">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-red-600">
                  4.8★
                </div>
                <div className="text-sm text-gray-600 mt-1">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                  Featured Products
                </span>
              </h2>
              <p className="text-gray-600 text-lg">Handpicked premium products you'll love</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Product Image */}
                  <div className="relative aspect-video overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                    <img
                      src={product.thumbnail_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {product.is_new && (
                        <span className="px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
                          NEW
                        </span>
                      )}
                      {product.is_bestseller && (
                        <span className="px-3 py-1 text-xs font-semibold bg-yellow-500 text-white rounded-full">
                          BESTSELLER
                        </span>
                      )}
                      {calculateDiscount(product.original_price, product.discounted_price) > 0 && (
                        <span className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                          -{calculateDiscount(product.original_price, product.discounted_price)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {/* Category & Type */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {product.category}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded capitalize">
                        {product.product_type}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600">
                      {product.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.short_description}
                    </p>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating.toFixed(1)} ({product.reviews_count})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      {product.discounted_price ? (
                        <>
                          <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                            {formatPrice(product.discounted_price, product.currency)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.original_price, product.currency)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                          {formatPrice(product.original_price, product.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products by Category */}
      {productsByCategory && Object.keys(productsByCategory).length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            {Object.entries(productsByCategory).map(([category, products]: [string, ShopProduct[]]) => (
              <div key={category} className="mb-16 last:mb-0">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                      {category === "Template" && "🎨 Templates"}
                      {category === "Component" && "🧩 Components"}
                      {category === "Tool" && "🔧 Tools"}
                      {category === "Other" && "📦 Other Products"}
                    </span>
                  </h2>
                  <span className="text-gray-500 font-medium">{products.length} items</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product: ShopProduct) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                        <img
                          src={product.thumbnail_url}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Badges */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                          {product.is_new && (
                            <span className="px-2 py-1 text-xs font-bold bg-green-500 text-white rounded shadow">
                              NEW
                            </span>
                          )}
                          {product.is_bestseller && (
                            <span className="px-2 py-1 text-xs font-bold bg-yellow-500 text-white rounded shadow">
                              🔥 HOT
                            </span>
                          )}
                        </div>
                        {calculateDiscount(product.original_price, product.discounted_price) > 0 && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded shadow">
                              {calculateDiscount(product.original_price, product.discounted_price)}% OFF
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-500 capitalize">
                            {product.subcategory || product.product_type}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-medium text-gray-700">
                            {product.rating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-400">
                            ({product.reviews_count})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          {product.discounted_price ? (
                            <>
                              <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                                {formatPrice(product.discounted_price, product.currency)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.original_price, product.currency)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                              {formatPrice(product.original_price, product.currency)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!allProducts || allProducts.length === 0) && (
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="text-6xl mb-6">🛍️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Products Yet</h2>
            <p className="text-gray-600 text-lg mb-8">
              Check back soon! We're adding amazing products.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 p-12 md:p-16 text-center text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Need Something Custom?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Can't find what you're looking for? I create custom templates, components, and tools tailored to your specific needs.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-xl bg-white text-purple-600 font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/projects"
                  className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold hover:scale-105 transition-transform hover:bg-white/20"
                >
                  View My Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
