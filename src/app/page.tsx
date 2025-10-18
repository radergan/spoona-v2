import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent mb-6">
            Spoona
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Smart recipe management and meal planning with seamless Instacart integration.
            Plan your week, create recipes, and shop with one click.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Recipe Management</h3>
              <p className="text-gray-600">Create, organize, and discover delicious recipes</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Meal Planning</h3>
              <p className="text-gray-600">Plan your weekly meals with drag-and-drop simplicity</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Smart Shopping</h3>
              <p className="text-gray-600">Generate shopping lists with Instacart integration</p>
            </div>
          </div>
          
          <div className="mt-12 space-x-4">
            <Link href="/auth" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block">
              Get Started
            </Link>
            <Link href="/dashboard" className="bg-white hover:bg-gray-50 text-orange-600 border-2 border-orange-500 px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block">
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}