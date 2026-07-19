'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { dynamic } from '@/lib/dynamic'

export default function AddProduct() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
      fetchCategories()
    }
  }, [session, status])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (!error) {
      setCategories(data || [])
    }
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
    setLoading(true)

    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const sku = formData.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`

    const productData = {
      name: formData.name,
      slug: slug,
      description: formData.description || null,
      price: parseFloat(formData.price) || 0,
      cost_price: parseFloat(formData.cost_price) || null,
      stock: parseInt(formData.stock) || 0,
      category_id: formData.category_id || null,
      sku: sku,
      is_active: formData.is_active
    }

    const { error } = await supabase
      .from('products')
      .insert([productData])

    if (!error) {
      router.push('/admin/products')
    } else {
      alert('Error adding product: ' + error.message)
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-[#1a3c6e]">Adding product...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add Product</h1>
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
                placeholder="e.g., 3/4 Inch PVC Pipe"
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
                placeholder="Describe your product..."
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
                  placeholder="2500"
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
                  placeholder="1800"
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
                  placeholder="50"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#1a3c6e] mb-1">SKU (Stock Keeping Unit)</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none"
                placeholder="Leave blank to auto-generate"
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
              disabled={loading}
              className="w-full bg-[#1a3c6e] text-white py-3 rounded-lg hover:bg-[#0f2a4a] disabled:opacity-50 transition font-bold"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
