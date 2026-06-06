import { ReceiptGenerator } from "@/components/receipt-generator"

export const metadata = {
  title: "Professional Receipt Generator | Susara Creations",
  description: "Create, print, download, and share professional receipts instantly for your business.",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Premium Header */}
      <header className="w-full bg-white border-b border-border shadow-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg overflow-hidden bg-purple-50 border border-purple-100 flex items-center justify-center p-1.5 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/favicon.png"
                alt="Receipt Generator Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <span>Receipt Generator</span>
                <span className="text-[10px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-wider select-none">
                  Secure
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Instantly create, print, download, and share professional receipts
              </p>
            </div>
          </div>

          {/* Quick Info/Badges */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground hidden md:inline">Powered by</span>
            <span className="font-medium bg-slate-50 text-slate-700 border border-border px-3 py-1.5 rounded-lg select-none">
              Susara Creations
            </span>
          </div>
        </div>
        {/* Subtle purple line indicator at bottom */}
        <div className="h-0.5 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600" />
      </header>

      {/* Main Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <ReceiptGenerator />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-card py-6 text-center text-xs text-muted-foreground select-none">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-foreground/80">Powered by Susara Creations</p>
          <p>&copy; {new Date().getFullYear()} Susara Creations. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
