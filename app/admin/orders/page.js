'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AdminOrders() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
    if (session) {
      fetchOrders()
    }
  }, [session, status])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setOrders(data || [])
    }
    setLoading(false)
  }

  const updateOrderStatus = async (id, newStatus) => {
    setUpdating(id)
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (!error) {
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      ))
    }
    setUpdating(null)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentColor = (status) => {
    const colors = {
      unpaid: 'bg-gray-100 text-gray-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-[#1a3c6e]">Loading orders...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Orders</h1>
          <a href="/admin/dashboard" className="hover:underline">← Dashboard</a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Order #</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Items</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Payment</th>
                  <th className="text-left p-4">Method</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center p-8 text-gray-500">
                      No orders yet. Share your store with customers!
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-mono text-sm">#{order.order_number}</td>
                      <td className="p-4">
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">{order.customer_email}</div>
                      </td>
                      <td className="p-4">
                        {order.items?.length || 0} items
                      </td>
                      <td className="p-4 font-bold">₦{order.total?.toLocaleString() || 0}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.payment_status)}`}>
                          {order.payment_status?.toUpperCase() || 'UNPAID'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {order.payment_method || 'whatsapp'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className="p-1 border rounded text-sm focus:ring-2 focus:ring-[#c99a3b] outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {orders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-gray-500 text-sm">Pending</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'processing').length}
              </div>
              <div className="text-gray-500 text-sm">Processing</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-gray-500 text-sm">Delivered</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-[#c99a3b]">
                ₦{orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-500 text-sm">Revenue (Paid)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
