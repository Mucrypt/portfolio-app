'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type ShopProduct = {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string
  product_type: string
  category: string
  subcategory: string | null
  thumbnail_url: string
  image_urls: string[] | null
  original_price: number
  discounted_price: number | null
  currency: string | null
  affiliate_link: string | null
  external_product_url: string | null
  demo_url: string | null
  download_url: string | null
  file_size: string | null
  file_format: string | null
  version: string | null
  sku: string | null
  stock_quantity: number | null
  is_in_stock: boolean | null
  shipping_required: boolean | null
  weight_kg: number | null
  features: string[] | string | null
  specifications: any
  tech_stack: string[] | string | null
  compatibility: string[] | string | null
  requirements: string[] | string | null
  included_items: string[] | string | null
  documentation_url: string | null
  support_url: string | null
  meta_title: string | null
  meta_description: string | null
  tags: string[] | string | null
  rating: number | null
  reviews_count: number | null
  purchases_count: number | null
  views_count: number | null
  is_featured: boolean | null
  is_published: boolean | null
  is_bestseller: boolean | null
  is_new: boolean | null
  sort_order: number | null
  license_type: string | null
  usage_rights: string | null
}

export default function AdminShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    description: '',
    product_type: 'digital' as 'physical' | 'digital' | 'affiliate',
    category: 'Template',
    subcategory: '',
    thumbnail_url: '',
    image_urls: '',
    original_price: 0,
    discounted_price: null as number | null,
    currency: 'USD',
    affiliate_link: '',
    external_product_url: '',
    demo_url: '',
    download_url: '',
    file_size: '',
    file_format: '',
    version: '',
    sku: '',
    stock_quantity: 0,
    is_in_stock: true,
    shipping_required: false,
    weight_kg: null as number | null,
    features: '',
    specifications: '',
    tech_stack: '',
    compatibility: '',
    requirements: '',
    included_items: '',
    documentation_url: '',
    support_url: '',
    meta_title: '',
    meta_description: '',
    tags: '',
    rating: 0,
    reviews_count: 0,
    purchases_count: 0,
    views_count: 0,
    is_featured: false,
    is_published: false,
    is_bestseller: false,
    is_new: false,
    sort_order: 0,
    license_type: '',
    usage_rights: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('shop_products')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setProducts(data || [])
    } catch (error: any) {
      setMessage('Error fetching products: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingProduct ? prev.slug : generateSlug(title),
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      short_description: '',
      description: '',
      product_type: 'digital',
      category: 'Template',
      subcategory: '',
      thumbnail_url: '',
      image_urls: '',
      original_price: 0,
      discounted_price: null,
      currency: 'USD',
      affiliate_link: '',
      external_product_url: '',
      demo_url: '',
      download_url: '',
      file_size: '',
      file_format: '',
      version: '',
      sku: '',
      stock_quantity: 0,
      is_in_stock: true,
      shipping_required: false,
      weight_kg: null,
      features: '',
      specifications: '',
      tech_stack: '',
      compatibility: '',
      requirements: '',
      included_items: '',
      documentation_url: '',
      support_url: '',
      meta_title: '',
      meta_description: '',
      tags: '',
      rating: 0,
      reviews_count: 0,
      purchases_count: 0,
      views_count: 0,
      is_featured: false,
      is_published: false,
      is_bestseller: false,
      is_new: false,
      sort_order: 0,
      license_type: '',
      usage_rights: '',
    })
    setEditingProduct(null)
  }

  const saveProduct = async () => {
    try {
      if (!formData.title || !formData.slug) {
        setMessage('Title and slug are required')
        return
      }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage('You must be logged in')
        return
      }

      // Parse arrays from comma or newline separated strings
      const parseArray = (str: string): string[] => {
        if (!str) return []
        return str
          .split(/[,\n]+/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      }

      // Parse JSONB from string
      const parseJSON = (str: string): any => {
        if (!str) return null
        try {
          return JSON.parse(str)
        } catch {
          return null
        }
      }

      const productData = {
        owner_user_id: user.id,
        title: formData.title,
        slug: formData.slug,
        short_description: formData.short_description,
        description: formData.description,
        product_type: formData.product_type,
        category: formData.category,
        subcategory: formData.subcategory || null,
        thumbnail_url: formData.thumbnail_url,
        image_urls: parseArray(formData.image_urls),
        original_price: formData.original_price,
        discounted_price: formData.discounted_price,
        currency: formData.currency,
        affiliate_link: formData.affiliate_link || null,
        external_product_url: formData.external_product_url || null,
        demo_url: formData.demo_url || null,
        download_url: formData.download_url || null,
        file_size: formData.file_size || null,
        file_format: formData.file_format || null,
        version: formData.version || null,
        sku: formData.sku || null,
        stock_quantity: formData.stock_quantity,
        is_in_stock: formData.is_in_stock,
        shipping_required: formData.shipping_required,
        weight_kg: formData.weight_kg,
        features: parseArray(formData.features),
        specifications: parseJSON(formData.specifications),
        tech_stack: parseArray(formData.tech_stack),
        compatibility: parseArray(formData.compatibility),
        requirements: parseArray(formData.requirements),
        included_items: parseArray(formData.included_items),
        documentation_url: formData.documentation_url || null,
        support_url: formData.support_url || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        tags: parseArray(formData.tags),
        rating: formData.rating,
        reviews_count: formData.reviews_count,
        purchases_count: formData.purchases_count,
        views_count: formData.views_count,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        is_bestseller: formData.is_bestseller,
        is_new: formData.is_new,
        sort_order: formData.sort_order,
        license_type: formData.license_type || null,
        usage_rights: formData.usage_rights || null,
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('shop_products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) throw error
        setMessage('Product updated successfully!')
      } else {
        const { error } = await supabase
          .from('shop_products')
          .insert([productData])

        if (error) throw error
        setMessage('Product created successfully!')
      }

      resetForm()
      fetchProducts()
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage('Error saving product: ' + error.message)
    }
  }

  const editProduct = (product: ShopProduct) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      slug: product.slug,
      short_description: product.short_description || '',
      description: product.description,
      product_type: product.product_type as any,
      category: product.category,
      subcategory: product.subcategory || '',
      thumbnail_url: product.thumbnail_url,
      image_urls: (product.image_urls || []).join('\n'),
      original_price: product.original_price,
      discounted_price: product.discounted_price,
      currency: product.currency || 'USD',
      affiliate_link: product.affiliate_link || '',
      external_product_url: product.external_product_url || '',
      demo_url: product.demo_url || '',
      download_url: product.download_url || '',
      file_size: product.file_size || '',
      file_format: product.file_format || '',
      version: product.version || '',
      sku: product.sku || '',
      stock_quantity: product.stock_quantity || 0,
      is_in_stock: product.is_in_stock || false,
      shipping_required: product.shipping_required || false,
      weight_kg: product.weight_kg,
      features: Array.isArray(product.features)
        ? product.features.join('\n')
        : product.features || '',
      specifications: product.specifications
        ? JSON.stringify(product.specifications, null, 2)
        : '',
      tech_stack: Array.isArray(product.tech_stack)
        ? product.tech_stack.join('\n')
        : product.tech_stack || '',
      compatibility: Array.isArray(product.compatibility)
        ? product.compatibility.join('\n')
        : product.compatibility || '',
      requirements: Array.isArray(product.requirements)
        ? product.requirements.join('\n')
        : product.requirements || '',
      included_items: Array.isArray(product.included_items)
        ? product.included_items.join('\n')
        : product.included_items || '',
      documentation_url: product.documentation_url || '',
      support_url: product.support_url || '',
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      tags: Array.isArray(product.tags)
        ? product.tags.join(', ')
        : product.tags || '',
      rating: product.rating || 0,
      reviews_count: product.reviews_count || 0,
      purchases_count: product.purchases_count || 0,
      views_count: product.views_count || 0,
      is_featured: product.is_featured || false,
      is_published: product.is_published || false,
      is_bestseller: product.is_bestseller || false,
      is_new: product.is_new || false,
      sort_order: product.sort_order || 0,
      license_type: product.license_type || '',
      usage_rights: product.usage_rights || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('shop_products')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage('Product deleted successfully!')
      fetchProducts()
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage('Error deleting product: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-xl'>Loading shop products...</div>
      </div>
    )
  }

  return (
    <div className='p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-4xl font-bold'>Shop Management</h1>
          <a
            href='/shop'
            target='_blank'
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            View Shop Page →
          </a>
        </div>

        {message && (
          <div className='mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg'>
            {message}
          </div>
        )}

        {/* Form */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <h2 className='text-2xl font-bold mb-6'>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Basic Information */}
            <div className='md:col-span-2'>
              <h3 className='text-lg font-semibold mb-4 text-gray-700 border-b pb-2'>
                Basic Information
              </h3>
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Title <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className='w-full p-2 border rounded'
                placeholder='Enter product title'
              />
            </div>

            <div>
              <label className='block mb-2 font-medium'>
                Slug <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className='w-full p-2 border rounded bg-gray-50'
                placeholder='auto-generated-slug'
              />
              <p className='text-xs text-gray-500 mt-1'>
                URL: /shop/{formData.slug || 'product-slug'}
              </p>
            </div>

            <div>
              <label className='block mb-2 font-medium'>Product Type</label>
              <select
                value={formData.product_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    product_type: e.target.value as any,
                  })
                }
                className='w-full p-2 border rounded'
              >
                <option value='digital'>Digital</option>
                <option value='physical'>Physical</option>
                <option value='affiliate'>Affiliate</option>
              </select>
            </div>

            <div>
              <label className='block mb-2 font-medium'>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className='w-full p-2 border rounded'
              >
                <option value='Template'>Template</option>
                <option value='Component'>Component</option>
                <option value='Tool'>Tool</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            <div>
              <label className='block mb-2 font-medium'>Subcategory</label>
              <input
                type='text'
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value })
                }
                className='w-full p-2 border rounded'
                placeholder='e.g., Website Template, React Component'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Short Description
              </label>
              <input
                type='text'
                value={formData.short_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    short_description: e.target.value,
                  })
                }
                className='w-full p-2 border rounded'
                placeholder='Brief one-line description'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>Full Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={6}
                className='w-full p-2 border rounded'
                placeholder='Detailed product description...'
              />
            </div>

            {/* Images */}
            <div className='md:col-span-2'>
              <h3 className='text-lg font-semibold mb-4 text-gray-700 border-b pb-2 mt-4'>
                Images
              </h3>
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>Thumbnail URL</label>
              <input
                type='text'
                value={formData.thumbnail_url}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail_url: e.target.value })
                }
                className='w-full p-2 border rounded'
                placeholder='https://example.com/image.jpg'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Additional Images (one per line)
              </label>
              <textarea
                value={formData.image_urls}
                onChange={(e) =>
                  setFormData({ ...formData, image_urls: e.target.value })
                }
                rows={3}
                className='w-full p-2 border rounded'
                placeholder='https://example.com/image1.jpg&#10;https://example.com/image2.jpg'
              />
            </div>

            {/* Pricing */}
            <div className='md:col-span-2'>
              <h3 className='text-lg font-semibold mb-4 text-gray-700 border-b pb-2 mt-4'>
                Pricing
              </h3>
            </div>

            <div>
              <label className='block mb-2 font-medium'>Original Price</label>
              <input
                type='number'
                step='0.01'
                value={formData.original_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    original_price: parseFloat(e.target.value) || 0,
                  })
                }
                className='w-full p-2 border rounded'
              />
            </div>

            <div>
              <label className='block mb-2 font-medium'>Discounted Price</label>
              <input
                type='number'
                step='0.01'
                value={formData.discounted_price || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discounted_price: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                className='w-full p-2 border rounded'
                placeholder='Leave empty for no discount'
              />
            </div>

            <div>
              <label className='block mb-2 font-medium'>Currency</label>
              <input
                type='text'
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className='w-full p-2 border rounded'
                placeholder='USD'
              />
            </div>

            {/* Links - MOST IMPORTANT! */}
            <div className='md:col-span-2'>
              <h3 className='text-lg font-semibold mb-4 text-gray-700 border-b pb-2 mt-4'>
                Links & URLs 🔥
              </h3>
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Affiliate Link{' '}
                <span className='text-red-500 font-bold'>
                  (MOST IMPORTANT!)
                </span>
              </label>
              <input
                type='text'
                value={formData.affiliate_link}
                onChange={(e) =>
                  setFormData({ ...formData, affiliate_link: e.target.value })
                }
                className='w-full p-2 border-2 border-yellow-400 rounded bg-yellow-50'
                placeholder='https://amazon.com/...?tag=YOUR_AFFILIATE_TAG or Udemy affiliate link'
              />
              <p className='text-xs text-gray-600 mt-1'>
                Your revenue source! Amazon, Udemy, or other affiliate tracking
                URL
              </p>
            </div>

            <div>
              <label className='block mb-2 font-medium'>
                External Product URL
              </label>
              <input
                type='text'
                value={formData.external_product_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    external_product_url: e.target.value,
                  })
                }
                className='w-full p-2 border rounded'
                placeholder='https://...'
              />
            </div>

            <div>
              <label className='block mb-2 font-medium'>Demo URL</label>
              <input
                type='text'
                value={formData.demo_url}
                onChange={(e) =>
                  setFormData({ ...formData, demo_url: e.target.value })
                }
                className='w-full p-2 border rounded'
                placeholder='https://demo.example.com'
              />
            </div>

            <div>
              <label className='block mb-2 font-medium'>Download URL</label>
              <input
                type='text'
                value={formData.download_url}
                onChange={(e) =>
                  setFormData({ ...formData, download_url: e.target.value })
                }
                className='w-full p-2 border rounded'
                placeholder='https://storage.example.com/product.zip'
              />
            </div>

            <div>
              <label className='block mb-2 font-medium'>
                Documentation URL
              </label>
              <input
                type='text'
                value={formData.documentation_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documentation_url: e.target.value,
                  })
                }
                className='w-full p-2 border rounded'
                placeholder='https://docs.example.com'
              />
            </div>

            {/* Digital Product Details */}
            {formData.product_type === 'digital' && (
              <>
                <div className='md:col-span-2'>
                  <h3 className='text-lg font-semibold mb-4 text-gray-700 border-b pb-2 mt-4'>
                    Digital Product Details
                  </h3>
                </div>

                <div>
                  <label className='block mb-2 font-medium'>File Size</label>
                  <input
                    type='text'
                    value={formData.file_size}
                    onChange={(e) =>
                      setFormData({ ...formData, file_size: e.target.value })
                    }
                    className='w-full p-2 border rounded'
                    placeholder='e.g., 8.5 MB'
                  />
                </div>

                <div>
                  <label className='block mb-2 font-medium'>File Format</label>
                  <input
                    type='text'
                    value={formData.file_format}
                    onChange={(e) =>
                      setFormData({ ...formData, file_format: e.target.value })
                    }
                    className='w-full p-2 border rounded'
                    placeholder='e.g., ZIP, PDF, Figma'
                  />
                </div>

                <div>
                  <label className='block mb-2 font-medium'>Version</label>
                  <input
                    type='text'
                    value={formData.version}
                    onChange={(e) =>
                      setFormData({ ...formData, version: e.target.value })
                    }
                    className='w-full p-2 border rounded'
                    placeholder='e.g., v1.0.0'
                  />
                </div>

                <div>
                  <label className='block mb-2 font-medium'>License Type</label>
                  <input
                    type='text'
                    value={formData.license_type}
                    onChange={(e) =>
                      setFormData({ ...formData, license_type: e.target.value })
                    }
                    className='w-full p-2 border rounded'
                    placeholder='e.g., Commercial, Personal, MIT'
                  />
                </div>
              </>
            )}

            {/* Physical Product Details */}
            {formData.product_type === 'physical' && (
              <>
                <div className='md:col-span-2'>
                  <h3 className='text-lg font-semibold mb-4 text-gray-700 border-b pb-2 mt-4'>
                    Physical Product / Dropshipping Details
                  </h3>
                </div>

                <div>
                  <label className='block mb-2 font-medium'>SKU</label>
                  <input
                    type='text'
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className='w-full p-2 border rounded'
                    placeholder='Product SKU'
                  />
                </div>

                <div>
                  <label className='block mb-2 font-medium'>
                    Stock Quantity
                  </label>
                  <input
                    type='number'
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>

                <div>
                  <label className='block mb-2 font-medium'>Weight (kg)</label>
                  <input
                    type='number'
                    step='0.01'
                    value={formData.weight_kg || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight_kg: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>

                <div className='flex items-center gap-4'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={formData.is_in_stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_in_stock: e.target.checked,
                        })
                      }
                      className='w-4 h-4'
                    />
                    <span>In Stock</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={formData.shipping_required}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping_required: e.target.checked,
                        })
                      }
                      className='w-4 h-4'
                    />
                    <span>Requires Shipping</span>
                  </label>
                </div>
              </>
            )}

            {/* Product Details */}
            <div className='md:col-span-2'>
              <h3 className='text-lg font-semibold mb-4 text-gray-700 border-b pb-2 mt-4'>
                Product Details
              </h3>
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Features (one per line)
              </label>
              <textarea
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                rows={5}
                className='w-full p-2 border rounded font-mono text-sm'
                placeholder='Built with Next.js 14&#10;TypeScript support&#10;Tailwind CSS styling'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Specifications (JSON format)
              </label>
              <textarea
                value={formData.specifications}
                onChange={(e) =>
                  setFormData({ ...formData, specifications: e.target.value })
                }
                rows={4}
                className='w-full p-2 border rounded font-mono text-sm'
                placeholder='{"pages": 8, "components": 45, "responsive": true}'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Tech Stack (one per line)
              </label>
              <textarea
                value={formData.tech_stack}
                onChange={(e) =>
                  setFormData({ ...formData, tech_stack: e.target.value })
                }
                rows={3}
                className='w-full p-2 border rounded font-mono text-sm'
                placeholder='Next.js 14&#10;React 18&#10;TypeScript'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Compatibility (one per line)
              </label>
              <textarea
                value={formData.compatibility}
                onChange={(e) =>
                  setFormData({ ...formData, compatibility: e.target.value })
                }
                rows={3}
                className='w-full p-2 border rounded font-mono text-sm'
                placeholder='Next.js 14+&#10;Node.js 18+&#10;React 18+'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Requirements (one per line)
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                rows={3}
                className='w-full p-2 border rounded font-mono text-sm'
                placeholder='Basic Next.js knowledge&#10;Node.js installed&#10;Code editor'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Included Items (one per line)
              </label>
              <textarea
                value={formData.included_items}
                onChange={(e) =>
                  setFormData({ ...formData, included_items: e.target.value })
                }
                rows={4}
                className='w-full p-2 border rounded font-mono text-sm'
                placeholder='Complete source code&#10;Documentation PDF&#10;Free lifetime updates'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>Usage Rights</label>
              <textarea
                value={formData.usage_rights}
                onChange={(e) =>
                  setFormData({ ...formData, usage_rights: e.target.value })
                }
                rows={2}
                className='w-full p-2 border rounded'
                placeholder='Use in unlimited personal and commercial projects...'
              />
            </div>

            {/* SEO */}
            <div className='md:col-span-2'>
              <h3 className='text-lg font-semibold mb-4 text-gray-700 border-b pb-2 mt-4'>
                SEO & Tags
              </h3>
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 font-medium'>
                Tags (comma-separated)
              </label>
              <input
                type='text'
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className='w-full p-2 border rounded'
                placeholder='React, TypeScript, Template, SaaS'
              />
            </div>

            {/* Stats & Status */}
            <div className='md:col-span-2'>
              <h3 className='text-lg font-semibold mb-4 text-gray-700 border-b pb-2 mt-4'>
                Stats & Status
              </h3>
            </div>

            <div>
              <label className='block mb-2 font-medium'>Sort Order</label>
              <input
                type='number'
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sort_order: parseInt(e.target.value) || 0,
                  })
                }
                className='w-full p-2 border rounded'
              />
            </div>

            <div className='md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4'>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className='w-4 h-4'
                />
                <span>Featured</span>
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={formData.is_bestseller}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_bestseller: e.target.checked,
                    })
                  }
                  className='w-4 h-4'
                />
                <span>Bestseller</span>
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={formData.is_new}
                  onChange={(e) =>
                    setFormData({ ...formData, is_new: e.target.checked })
                  }
                  className='w-4 h-4'
                />
                <span>New</span>
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={formData.is_published}
                  onChange={(e) =>
                    setFormData({ ...formData, is_published: e.target.checked })
                  }
                  className='w-4 h-4'
                />
                <span className='font-semibold'>Published</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 mt-8'>
            <button
              onClick={saveProduct}
              className='px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform'
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
            {editingProduct && (
              <button
                onClick={resetForm}
                className='px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600'
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Products List */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-2xl font-bold mb-6'>
            All Products ({products.length})
          </h2>

          {products.length === 0 ? (
            <p className='text-gray-500 text-center py-8'>
              No products yet. Create your first product above!
            </p>
          ) : (
            <div className='space-y-4'>
              {products.map((product) => (
                <div
                  key={product.id}
                  className='border rounded-lg p-4 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-start gap-4'>
                    <img
                      src={product.thumbnail_url}
                      alt={product.title}
                      className='w-32 h-20 object-cover rounded'
                    />
                    <div className='flex-1'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <h3 className='text-lg font-bold text-gray-900'>
                            {product.title}
                          </h3>
                          <div className='flex items-center gap-2 mt-2'>
                            <span className='px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded'>
                              {product.category}
                            </span>
                            <span className='px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded capitalize'>
                              {product.product_type}
                            </span>
                            {product.is_featured && (
                              <span className='px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded'>
                                ⭐ Featured
                              </span>
                            )}
                            {product.is_bestseller && (
                              <span className='px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded'>
                                🔥 Bestseller
                              </span>
                            )}
                            {product.is_new && (
                              <span className='px-2 py-1 text-xs bg-green-100 text-green-700 rounded'>
                                ✨ New
                              </span>
                            )}
                            {!product.is_published && (
                              <span className='px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded'>
                                Draft
                              </span>
                            )}
                          </div>
                          <p className='text-sm text-gray-600 mt-2'>
                            ${product.original_price}
                            {product.discounted_price &&
                              ` → $${product.discounted_price}`}{' '}
                            | ⭐ {product.rating} ({product.reviews_count}{' '}
                            reviews) | {product.purchases_count} purchases
                          </p>
                        </div>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => editProduct(product)}
                            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
