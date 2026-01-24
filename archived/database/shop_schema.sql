-- =========================================================
-- SHOP PRODUCTS TABLE SCHEMA
-- =========================================================
-- Comprehensive e-commerce schema for affiliate marketing & dropshipping
-- Supports: Amazon affiliate links, digital products, physical products, templates, tools, components

CREATE TABLE IF NOT EXISTS shop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT NOT NULL,
  
  -- Product Type & Category
  product_type TEXT NOT NULL CHECK (product_type IN ('physical', 'digital', 'affiliate')),
  category TEXT NOT NULL CHECK (category IN ('Template', 'Component', 'Tool', 'Other')),
  subcategory TEXT, -- e.g., 'Website Template', 'React Component', 'Chrome Extension', etc.
  
  -- Images
  thumbnail_url TEXT NOT NULL,
  image_urls TEXT[], -- Array of additional product images
  
  -- Pricing
  original_price DECIMAL(10, 2) NOT NULL,
  discounted_price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  discount_percentage INTEGER, -- Auto-calculated or set manually
  
  -- Affiliate & External Links
  affiliate_link TEXT, -- Amazon affiliate link or other affiliate URLs
  external_product_url TEXT, -- Link to external product page
  demo_url TEXT, -- Live demo URL for templates/tools
  
  -- Digital Product Details
  download_url TEXT, -- For digital products (templates, components, tools)
  file_size TEXT, -- e.g., '2.5 MB', '150 KB'
  file_format TEXT, -- e.g., 'ZIP', 'PDF', 'Figma', 'Sketch'
  version TEXT, -- Product version (e.g., 'v1.0.0', 'v2.3.1')
  
  -- Physical Product / Dropshipping Details
  sku TEXT, -- Stock Keeping Unit
  stock_quantity INTEGER DEFAULT 0,
  is_in_stock BOOLEAN DEFAULT true,
  shipping_required BOOLEAN DEFAULT false,
  weight_kg DECIMAL(8, 2), -- Product weight in kg
  
  -- Product Specifications
  features TEXT[], -- Array of key features/highlights
  specifications JSONB, -- JSON object for detailed specs (e.g., {browser: 'Chrome, Firefox', framework: 'React 18'})
  tech_stack TEXT[], -- Technologies used (for templates/components/tools)
  compatibility TEXT[], -- What it works with (e.g., ['Next.js 14+', 'React 18+', 'TypeScript'])
  
  -- Requirements & Usage
  requirements TEXT[], -- What users need to use the product
  included_items TEXT[], -- What's included in the package
  documentation_url TEXT, -- Link to documentation
  support_url TEXT, -- Link to support/help
  
  -- SEO & Marketing
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[], -- SEO tags and searchable keywords
  
  -- Social Proof & Ratings
  rating DECIMAL(3, 2) DEFAULT 0, -- Average rating (0.00 to 5.00)
  reviews_count INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0, -- Total number of purchases/downloads
  views_count INTEGER DEFAULT 0,
  
  -- Status & Visibility
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false, -- New arrival
  sort_order INTEGER DEFAULT 0,
  
  -- License & Usage Rights
  license_type TEXT, -- e.g., 'Personal', 'Commercial', 'Extended', 'MIT', 'GPL'
  usage_rights TEXT, -- Description of what buyers can do with the product
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- =========================================================
-- INDEXES
-- =========================================================

-- Unique slug for SEO-friendly URLs
CREATE UNIQUE INDEX IF NOT EXISTS ux_shop_products_slug ON shop_products(slug);

-- Owner queries
CREATE INDEX IF NOT EXISTS idx_shop_products_owner ON shop_products(owner_user_id);

-- Category filtering
CREATE INDEX IF NOT EXISTS idx_shop_products_category ON shop_products(category);

-- Product type filtering
CREATE INDEX IF NOT EXISTS idx_shop_products_type ON shop_products(product_type);

-- Featured products
CREATE INDEX IF NOT EXISTS idx_shop_products_featured ON shop_products(is_featured) WHERE is_featured = true;

-- Published products
CREATE INDEX IF NOT EXISTS idx_shop_products_published ON shop_products(is_published) WHERE is_published = true;

-- Bestsellers
CREATE INDEX IF NOT EXISTS idx_shop_products_bestseller ON shop_products(is_bestseller) WHERE is_bestseller = true;

-- Sort order
CREATE INDEX IF NOT EXISTS idx_shop_products_sort ON shop_products(sort_order);

-- =========================================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================================

ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;

-- Public can read published products
CREATE POLICY "public read published products"
  ON shop_products
  FOR SELECT
  USING (is_published = true);

-- Owner can manage their products
CREATE POLICY "owner manage products"
  ON shop_products
  FOR ALL
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

-- =========================================================
-- TRIGGER FOR UPDATED_AT
-- =========================================================

CREATE TRIGGER trg_shop_products_updated_at
  BEFORE UPDATE ON shop_products
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- COMMENTS
-- =========================================================

COMMENT ON TABLE shop_products IS 'E-commerce products table supporting affiliate marketing, dropshipping, and digital products';
COMMENT ON COLUMN shop_products.product_type IS 'Type: physical (dropshipping), digital (downloadable), affiliate (external link)';
COMMENT ON COLUMN shop_products.category IS 'Main category: Template, Component, Tool, Other';
COMMENT ON COLUMN shop_products.affiliate_link IS 'Amazon affiliate or other affiliate tracking URL - MOST IMPORTANT for revenue!';
COMMENT ON COLUMN shop_products.specifications IS 'JSONB object for flexible product specs (e.g., {browser: "Chrome", size: "Large"})';
COMMENT ON COLUMN shop_products.tech_stack IS 'Technologies used in the product (for templates/components/tools)';
