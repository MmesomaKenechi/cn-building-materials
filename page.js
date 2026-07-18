'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f6f3]">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏗️</div>
          <h1 className="text-3xl font-bold text-[#1a3c6e]">C.N Building Materials</h1>
          <p className="text-gray-500 mt-1">Admin Dashboard Login</p>
          <div className="w-20 h-1 bg-[#c99a3b] mx-auto mt-3 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-[#1a3c6e] mb-1">Email Address</label>
            <input
              type="email"
              placeholder="admin@cnbuilding.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-gray-50"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-[#1a3c6e] mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c99a3b] focus:border-[#c99a3b] outline-none bg-gray-50"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a3c6e] text-white py-3 rounded-lg font-bold hover:bg-[#0f2a4a] disabled:opacity-50 transition"
          >
            {loading ? 'Logging in...' : '🔑 Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6 border-t border-gray-100 pt-6">
          Authorized Administrators Only
        </p>
      </div>
    </div>
  )
}