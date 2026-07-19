'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AdminProducts() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
    if (session) {
      fetchProducts()
    }
  }, [session, status])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })

    if (!error) {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    setDeleting(id)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (!error) {
      setProducts(products.filter(p => p.id !== id))
    }
    setDeleting(null)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-[#1a3c6e]">Loading products...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <div className="flex items-center gap-4">
            <a href="/admin/dashboard" className="hover:underline">← Dashboard</a>
            <a href="/admin/products/add" className="bg-[#c99a3b] text-[#1a3c6e] px-4 py-1 rounded hover:bg-[#e8b84b] transition font-bold">
              + Add Product
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-500">
                      No products yet. Click "Add Product" to get started!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-[#1a3c6e]">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </td>
                      <td className="p-4">{product.categories?.name || 'Uncategorized'}</td>
                      <td className="p-4 font-medium">₦{product.price?.toLocaleString() || 0}</td>
                      <td className="p-4">
                        <span className={product.stock < 10 ? 'text-red-600 font-bold' : ''}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 space-x-2">
                        <a 
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✏️
                        </a>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {deleting === product.id ? '⏳' : '🗑️'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
