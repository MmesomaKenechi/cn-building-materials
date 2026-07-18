import './globals.css'

export const metadata = {
  title: 'C.N Building Materials',
  description: 'Quality building materials in Nigeria - Plumbing, Welding, Carpentry',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}