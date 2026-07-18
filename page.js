'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function OrderConfirmation() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    } else {
      setLoading(false)
    }
  }, [orderId])

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (!error) {
      setOrder(data)
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-[#1a3c6e]">Loading order details...</div>
    </div>
  )

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8f6f3]">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-[#1a3c6e]">Order Not Found</h1>
          <p className="text-gray-500 mt-2">We couldn't find your order details.</p>
          <a href="/shop" className="inline-block mt-4 text-[#c99a3b] hover:underline">
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold">🏗️ C.N Building Materials</a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600">Order Placed Successfully!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your order. We'll contact you shortly to confirm delivery.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number</span>
              <span className="font-mono font-bold text-[#1a3c6e]">#{order.order_number}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-500">Date</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-500">Status</span>
              <span className="capitalize font-medium text-[#c99a3b]">{order.status}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-500">Payment</span>
              <span className="capitalize">{order.payment_status}</span>
            </div>
          </div>

          <div className="border-b pb-4 mb-4">
            <h3 className="font-bold text-[#1a3c6e] mb-2">Items</h3>
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between text-sm py-1">
                <span>{item.name} × {item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-b pb-4 mb-4">
            <h3 className="font-bold text-[#1a3c6e] mb-2">Delivery Details</h3>
            <p className="text-sm">{order.customer_name}</p>
            <p className="text-sm text-gray-600">{order.customer_phone}</p>
            <p className="text-sm text-gray-600">{order.customer_email}</p>
            {order.shipping_address && (
              <p className="text-sm text-gray-600 mt-1">
                {order.shipping_address.address}
                {order.shipping_address.city && `, ${order.shipping_address.city}`}
                {order.shipping_address.state && `, ${order.shipping_address.state}`}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#d44c2c]">₦{order.total?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <a 
            href="/shop" 
            className="flex-1 bg-[#1a3c6e] text-white py-3 rounded-lg text-center hover:bg-[#0f2a4a] transition font-bold"
          >
            Continue Shopping
          </a>
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg text-center hover:bg-gray-300 transition font-medium"
          >
            Print Order
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {order.payment_method === 'whatsapp' 
            ? 'We will contact you via WhatsApp to confirm delivery and payment.' 
            : 'A payment confirmation email will be sent to you shortly.'}
        </p>
      </div>
    </div>
  )
}