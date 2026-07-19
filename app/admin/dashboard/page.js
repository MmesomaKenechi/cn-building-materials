'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { dynamic } from '@/lib/dynamic'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    lowStock: 0,
    pendingOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
    if (session) {
      fetchDashboardData()
    }
  }, [session, status])

  const fetchDashboardData = async () => {
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    const { count: lowStockCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .lt('stock', 10)

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    const { count: pendingCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const { data: paidOrders } = await supabase
      .from('orders')
      .select('total')
      .eq('payment_status', 'paid')

    const revenue = paidOrders?.reduce((sum, o) => sum + o.total, 0) || 0

    setStats({
      products: productCount || 0,
      orders: orders?.length || 0,
      revenue: revenue,
      lowStock: lowStockCount || 0,
      pendingOrders: pendingCount || 0
    })
    setRecentOrders(orders || [])
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
      <div className="text-xl text-[#1a3c6e]">Loading dashboard...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{session?.user?.email}</span>
            <button 
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-[#1a3c6e]">{stats.products}</div>
            <div className="text-gray-500 text-sm">Total Products</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-green-600">{stats.orders}</div>
            <div className="text-gray-500 text-sm">Total Orders</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-[#c99a3b]">₦{stats.revenue.toLocaleString()}</div>
            <div className="text-gray-500 text-sm">Revenue</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-red-600">{stats.lowStock}</div>
            <div className="text-gray-500 text-sm">Low Stock</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</div>
            <div className="text-gray-500 text-sm">Pending Orders</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <a href="/admin/products" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">📦</div>
            <h3 className="font-bold text-[#1a3c6e]">Manage Products</h3>
            <p className="text-sm text-gray-500">Add, edit, or delete products</p>
          </a>
          <a href="/admin/orders" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">🛒</div>
            <h3 className="font-bold text-[#1a3c6e]">View Orders</h3>
            <p className="text-sm text-gray-500">Manage customer orders</p>
          </a>
          <a href="/admin/products/add" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">➕</div>
            <h3 className="font-bold text-[#1a3c6e]">Add Product</h3>
            <p className="text-sm text-gray-500">Quickly add a new product</p>
          </a>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-[#1a3c6e] mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm">Order #</th>
                    <th className="text-left py-2 text-sm">Customer</th>
                    <th className="text-left py-2 text-sm">Total</th>
                    <th className="text-left py-2 text-sm">Status</th>
                    <th className="text-left py-2 text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 text-sm font-mono">#{order.order_number}</td>
                      <td className="py-2 text-sm">{order.customer_name}</td>
                      <td className="py-2 text-sm font-medium">₦{order.total?.toLocaleString() || 0}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-2 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
