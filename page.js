'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    setCategories(data || [])
  }

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (!error) {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || p.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-[#1a3c6e]">Loading products...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
          <a href="/" className="text-xl font-bold">🏗️ C.N Building Materials</a>
          <div className="flex items-center gap-4">
            <a href="/" className="nav-link text-sm">← Home</a>
            <a href="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              <span className="absolute -top-2 -right-3 bg-[#c99a3b] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="section-title">Our Products</h1>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-white"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="text-gray-500 mb-4">{filteredProducts.length} products found</p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="h-48 bg-gray-100 flex items-center justify-center text-5xl">
                📦
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-[#1a3c6e]">{product.name}</h3>
                  <span className="text-xs bg-[#c99a3b] text-white px-2 py-1 rounded-full">
                    {product.categories?.name || 'General'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="price-tag">{product.price?.toLocaleString() || 0}</span>
                  <span className="text-sm text-gray-500">📦 {product.stock || 0} in stock</span>
                </div>
                <a 
                  href={`/product/${product.id}`}
                  className="block mt-4 bg-[#1a3c6e] text-white text-center py-3 rounded-lg hover:bg-[#0f2a4a] transition font-medium"
                >
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-500">No products found matching your criteria</p>
            <button 
              onClick={() => { setSearch(''); setSelectedCategory('') }}
              className="mt-4 text-[#c99a3b] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}