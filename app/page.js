export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-[#1a3c6e] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏗️</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">C.N Building Materials</h1>
              <p className="text-xs text-blue-200">Quality Since 2024</p>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <a href="/shop" className="nav-link text-sm">Shop</a>
            <a href="/admin/login" className="nav-link text-sm">Admin</a>
            <a href="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              <span className="absolute -top-2 -right-3 bg-[#c99a3b] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a3c6e] via-[#2a5298] to-[#0f2a4a] text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#c99a3b] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#c99a3b] rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-[#c99a3b] text-[#1a3c6e] px-4 py-1 rounded-full text-sm font-bold mb-4">
              🇳🇬 Trusted by Nigerians Nationwide
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your One-Stop <span className="text-[#c99a3b]">Building Materials</span> Shop
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Quality plumbing, welding, and carpentry supplies delivered to your doorstep.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/shop" 
                className="bg-[#c99a3b] text-[#1a3c6e] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#e8b84b] transition transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Browse Products →
              </a>
              <a 
                href="https://wa.me/234XXXXXXXXX"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                💬 Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="section-title text-center mx-auto">Shop by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {['Plumbing', 'Welding', 'Carpentry'].map((cat) => (
            <div key={cat} className="bg-white p-8 rounded-xl text-center shadow-md card-hover cursor-pointer">
              <div className="text-5xl mb-4">
                {cat === 'Plumbing' ? '🔧' : cat === 'Welding' ? '⚡' : '🪚'}
              </div>
              <h4 className="text-xl font-bold text-[#1a3c6e]">{cat}</h4>
              <p className="text-sm text-gray-500 mt-1">Quality supplies</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#f8f6f3] py-16">
        <div className="container mx-auto px-4">
          <h3 className="section-title text-center mx-auto">Why Choose C.N Building Materials?</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md text-center card-hover">
              <div className="text-5xl mb-4">✅</div>
              <h4 className="text-xl font-bold text-[#1a3c6e]">Quality Assured</h4>
              <p className="text-gray-600 mt-2">Premium building materials from trusted manufacturers</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center card-hover">
              <div className="text-5xl mb-4">💰</div>
              <h4 className="text-xl font-bold text-[#1a3c6e]">Best Prices</h4>
              <p className="text-gray-600 mt-2">Competitive rates with no hidden charges</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center card-hover">
              <div className="text-5xl mb-4">🚚</div>
              <h4 className="text-xl font-bold text-[#1a3c6e]">Fast Delivery</h4>
              <p className="text-gray-600 mt-2">Reliable delivery across Nigeria</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] text-white p-8 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🏗️</span>
            <p className="font-bold text-xl">C.N Building Materials</p>
          </div>
          <p className="text-gray-400 text-sm">Serving Nigeria with quality building materials since 2024</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <a href="tel:+234XXXXXXXXX" className="text-gray-400 hover:text-white transition">📞 Call Us</a>
            <a href="https://wa.me/234XXXXXXXXX" className="text-gray-400 hover:text-white transition">💬 WhatsApp</a>
            <a href="/shop" className="text-gray-400 hover:text-white transition">🛒 Shop</a>
          </div>
          <p className="text-xs text-gray-600 mt-6">© 2026 C.N Building Materials. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
