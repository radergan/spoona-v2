import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gh-canvas-default to-gh-canvas-subtle">
      <div className="container mx-auto px-gh-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gh-fg-default mb-gh-6">
            Spoona
          </h1>
          <p className="text-xl text-gh-fg-muted mb-gh-8 leading-relaxed">
            Smart recipe management and meal planning with seamless Instacart integration.
            Plan your week, create recipes, and shop with one click.
          </p>
          
          <div className="grid md:grid-cols-3 gap-gh-6 mt-12">
            <div className="bg-gh-canvas-default border border-gh-border-default p-gh-6 rounded-gh-md shadow-gh-sm hover:shadow-gh-md transition-all">
              <div className="w-10 h-10 bg-gh-accent-subtle rounded-gh-sm flex items-center justify-center mx-auto mb-gh-4">
                <svg className="w-5 h-5 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-gh-2 text-gh-fg-default">Recipe Management</h3>
              <p className="text-gh-fg-muted">Create, organize, and discover delicious recipes</p>
            </div>
            
            <div className="bg-gh-canvas-default border border-gh-border-default p-gh-6 rounded-gh-md shadow-gh-sm hover:shadow-gh-md transition-all">
              <div className="w-10 h-10 bg-gh-success-subtle rounded-gh-sm flex items-center justify-center mx-auto mb-gh-4">
                <svg className="w-5 h-5 text-gh-success-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-gh-2 text-gh-fg-default">Meal Planning</h3>
              <p className="text-gh-fg-muted">Plan your weekly meals with drag-and-drop simplicity</p>
            </div>
            
            <div className="bg-gh-canvas-default border border-gh-border-default p-gh-6 rounded-gh-md shadow-gh-sm hover:shadow-gh-md transition-all">
              <div className="w-10 h-10 bg-gh-severe-subtle rounded-gh-sm flex items-center justify-center mx-auto mb-gh-4">
                <svg className="w-5 h-5 text-gh-severe-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-gh-2 text-gh-fg-default">Smart Shopping</h3>
              <p className="text-gh-fg-muted">Generate shopping lists with Instacart integration</p>
            </div>
          </div>
          
          <div className="mt-12 space-x-gh-4">
            <Link href="/auth" className="bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis px-gh-6 py-3 rounded-gh-md text-lg font-semibold transition-colors inline-block shadow-gh-sm">
              Get Started
            </Link>
            <Link href="/dashboard" className="bg-gh-canvas-default hover:bg-gh-canvas-subtle text-gh-fg-default border border-gh-border-default px-gh-6 py-3 rounded-gh-md text-lg font-semibold transition-colors inline-block">
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}