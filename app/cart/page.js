'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Cart() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedCart = localStorage.getItem('cn_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        setCart([])
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cn_cart', JSON.stringify(cart))
    }
  }, [cart, loading])

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId)
      return
    }
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const removeItem = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setCart([])
    }
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-[#1a3c6e]">Loading cart...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold">🏗️ C.N Building Materials</a>
          <a href="/shop" className="nav-link text-sm">← Continue Shopping</a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="section-title">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-600">Your cart is empty</h2>
            <p className="text-gray-500 mt-2">Browse our products and add items you need</p>
            <a 
              href="/shop"
              className="inline-block mt-4 bg-[#1a3c6e] text-white px-6 py-3 rounded-lg hover:bg-[#0f2a4a] transition font-bold"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 flex flex-wrap items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      📦
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <h3 className="font-bold text-[#1a3c6e]">{item.name}</h3>
                      <p className="text-gray-500 text-sm">₦{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right min-w-[120px]">
                      <div className="font-bold text-[#1a3c6e]">₦{(item.price * item.quantity).toLocaleString()}</div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md ml-auto">
              <h2 className="text-lg font-bold text-[#1a3c6e] mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({getItemCount()})</span>
                  <span>₦{getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Calculated at checkout</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₦{getTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Clear Cart
                </button>
                <a
                  href="/checkout"
                  className="flex-1 bg-[#d44c2c] text-white py-3 rounded-lg text-center hover:bg-[#b83d20] transition font-bold"
                >
                  Proceed to Checkout →
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
