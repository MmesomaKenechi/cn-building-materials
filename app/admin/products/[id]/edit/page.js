'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { dynamic } from '@/lib/dynamic'

export default function EditProduct({ params }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost_price: '',
    stock: '',
    category_id: '',
    sku: '',
    is_active: true
  })
  const supabase = createClient()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
    if (session) {
      fetchData()
    }
  }, [session, status])

  const fetchData = async () => {
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    setCategories(categoriesData || [])

    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

    if (productData) {
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || '',
        cost_price: productData.cost_price || '',
        stock: productData.stock || '',
        category_id: productData.category_id || '',
        sku: productData.sku || '',
        is_active: productData.is_active !== false
      })
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const productData = {
      name: formData.name,
      slug: slug,
      description: formData.description || null,
      price: parseFloat(formData.price) || 0,
      cost_price: parseFloat(formData.cost_price) || null,
      stock: parseInt(formData.stock) || 0,
      category_id: formData.category_id || null,
      sku: formData.sku || `SKU-${Date.now()}`,
      is_active: formData.is_active,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', params.id)

    if (!error) {
      router.push('/admin/products')
    } else {
      alert('Error updating product: ' + error.message)
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-[#1a3c6e]">Loading product...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <a href="/admin/products" className="hover:underline">← Back to Products</a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-[#1a3c6e] mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1a3c6e] mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#1a3c6e] mb-1">Selling Price (₦) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#1a3c6e] mb-1">Cost Price (₦)</label>
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#1a3c6e] mb-1">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#1a3c6e] mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#1a3c6e] mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label className="font-medium text-[#1a3c6e]">Product is active (visible in store)</label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#1a3c6e] text-white py-3 rounded-lg hover:bg-[#0f2a4a] disabled:opacity-50 transition font-bold"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
