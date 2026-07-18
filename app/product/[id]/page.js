'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', params.id)
      .single()

    if (!error) {
      setProduct(data)
    }
    setLoading(false)
  }

  const addToCart = () => {
    if (!product) return
    
    setAdding(true)
    const savedCart = localStorage.getItem('cn_cart')
    let cart = savedCart ? JSON.parse(savedCart) : []
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        maxStock: product.stock
      })
    }
    localStorage.setItem('cn_cart', JSON.stringify(cart))
    setAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-[#1a3c6e]">Loading product...</div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-red-600">Product not found</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
          <a href="/" className="text-xl font-bold">🏗️ C.N Building Materials</a>
          <div className="flex items-center gap-4">
            <a href="/shop" className="nav-link text-sm">← Shop</a>
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="h-80 md:h-auto bg-gray-100 flex items-center justify-center text-8xl">
              📦
            </div>
            
            {/* Details */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm bg-[#c99a3b] text-white px-3 py-1 rounded-full">
                  {product.categories?.name || 'General'}
                </span>
                {product.stock < 10 && (
                  <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
                    Low Stock!
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-[#1a3c6e]">{product.name}</h1>
              <p className="text-3xl font-bold text-[#d44c2c] mt-4 price-tag">
                {product.price?.toLocaleString() || 0}
              </p>
              <p className="text-gray-500 mt-2">📦 {product.stock || 0} available</p>
              <p className="text-gray-700 mt-4 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>

              {product.stock > 0 ? (
                <div className="mt-6">
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-[#1a3c6e]">Quantity:</label>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100 text-lg font-bold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1
                          setQuantity(Math.min(Math.max(1, val), product.stock))
                        }}
                        className="w-16 text-center p-2 border-x-2 border-gray-200 focus:outline-none font-bold"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-2 hover:bg-gray-100 text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={addToCart}
                    disabled={adding}
                    className="w-full mt-6 bg-[#d44c2c] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#b83d20] transition disabled:opacity-50"
                  >
                    {adding ? 'Adding...' : added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                  </button>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-center text-red-600 font-bold">
                  ❌ Out of Stock
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">Need help? Order via WhatsApp:</p>
                <a 
                  href={`https://wa.me/234XXXXXXXXX?text=Hello! I want to order ${product.name}`}
                  className="inline-block mt-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                  💬 Chat with Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
