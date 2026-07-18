'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Checkout() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('whatsapp')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    notes: ''
  })
  const supabase = createClient()

  useEffect(() => {
    const savedCart = localStorage.getItem('cn_cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        if (items.length === 0) {
          router.push('/cart')
        }
        setCart(items)
      } catch (e) {
        router.push('/cart')
      }
    } else {
      router.push('/cart')
    }
    setLoading(false)
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const generateOrderNumber = () => {
    const prefix = 'CN'
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    return `${prefix}-${timestamp}-${random}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required fields')
      setSubmitting(false)
      return
    }

    const total = getTotal()
    const orderNumber = generateOrderNumber()

    const orderData = {
      order_number: orderNumber,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal: total,
      delivery_fee: 0,
      total: total,
      status: 'pending',
      payment_status: 'unpaid',
      shipping_address: {
        address: formData.address,
        city: formData.city,
        state: formData.state
      },
      notes: formData.notes || null,
      payment_method: paymentMethod
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()

    if (error) {
      alert('Error placing order: ' + error.message)
      setSubmitting(false)
      return
    }

    localStorage.removeItem('cn_cart')

    // Redirect based on payment method
    if (paymentMethod === 'whatsapp') {
      const message = `Hello! I just placed an order (${orderNumber}). My name is ${formData.name}.`
      const whatsappUrl = `https://wa.me/234XXXXXXXXX?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
      router.push(`/order-confirmation?id=${data[0].id}`)
    } else {
      // Paystack payment - we'll handle this in the next step
      router.push(`/payment/${data[0].id}`)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-[#1a3c6e]">Loading checkout...</div>
    </div>
  )

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-600">Your cart is empty</h2>
          <a href="/shop" className="text-[#1a3c6e] hover:underline">Continue shopping</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold">🏗️ C.N Building Materials</a>
          <a href="/cart" className="nav-link text-sm">← Back to Cart</a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="section-title">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1a3c6e] mb-4">Delivery Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#1a3c6e] mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1a3c6e] mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#1a3c6e] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-white"
                    placeholder="08012345678"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1a3c6e] mb-1">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="2"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-white"
                    placeholder="123 Main Street, Lagos"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#1a3c6e] mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-white"
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1a3c6e] mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-white"
                      placeholder="Lagos"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#1a3c6e] mb-1">Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-white"
                    placeholder="Any special instructions..."
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block font-bold text-[#1a3c6e] mb-3">Choose Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('whatsapp')}
                      className={`p-3 rounded-lg border-2 transition ${
                        paymentMethod === 'whatsapp' 
                          ? 'border-green-600 bg-green-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-2xl">💬</div>
                      <div className="font-medium text-sm">Order via WhatsApp</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paystack')}
                      className={`p-3 rounded-lg border-2 transition ${
                        paymentMethod === 'paystack' 
                          ? 'border-[#1a3c6e] bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-2xl">💳</div>
                      <div className="font-medium text-sm">Pay with Card</div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#d44c2c] text-white py-3 rounded-lg hover:bg-[#b83d20] disabled:opacity-50 transition font-bold text-lg"
                >
                  {submitting ? 'Placing Order...' : paymentMethod === 'whatsapp' ? 'Place Order via WhatsApp' : 'Pay Now'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-lg font-bold text-[#1a3c6e] mb-4">Order Summary</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Calculated on order</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>₦{getTotal().toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                {paymentMethod === 'whatsapp' 
                  ? 'We\'ll confirm delivery fees via WhatsApp.' 
                  : 'Pay securely with your card or bank transfer.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
