import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import { ReceiptPreview } from "@/components/receipt-preview"
import { ReceiptViewClient } from "@/components/receipt-view-client"
import { ReceiptData } from "@/types/receipt"

interface ReceiptPageProps {
  params: Promise<{ id: string }>
}

async function getReceiptData(id: string): Promise<ReceiptData | null> {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "receipts.json")
    if (!fs.existsSync(filePath)) return null

    const fileContent = fs.readFileSync(filePath, "utf-8")
    const receipts = JSON.parse(fileContent || "{}")
    return receipts[id] || null
  } catch (error) {
    console.error("Error reading receipt from JSON database:", error)
    return null
  }
}

export async function generateMetadata({ params }: ReceiptPageProps) {
  const { id } = await params
  const receipt = await getReceiptData(id)
  
  if (!receipt) {
    return {
      title: "Receipt Not Found | Susara Creations",
    }
  }

  const subtotal = receipt.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  
  const isDiscountPercentage = (receipt.discountType || "percentage") === "percentage"
  const discountRate = receipt.discountRate || 0
  const discountAmount = isDiscountPercentage
    ? subtotal * (discountRate / 100)
    : discountRate

  const isTaxPercentage = (receipt.taxType || "percentage") === "percentage"
  const taxRate = receipt.taxRate || 0
  const taxAmount = isTaxPercentage 
    ? subtotal * (taxRate / 100) 
    : taxRate

  const total = Math.max(0, subtotal - discountAmount + taxAmount)

  return {
    title: `Receipt ${receipt.receiptNumber} - ${receipt.businessName}`,
    description: `Official receipt from ${receipt.businessName} for total amount Rs. ${total.toFixed(2)}.`,
  }
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { id } = await params
  const receipt = await getReceiptData(id)

  if (!receipt) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Verification banner */}
        <div className="bg-emerald-50 text-emerald-850 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 shadow-xs hide-on-print animate-in fade-in slide-in-from-top-4 duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 shrink-0 text-emerald-600"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div className="text-xs sm:text-sm font-medium">
            Verified Receipt. This invoice is digitally secure and official.
          </div>
        </div>

        {/* The Receipt structure */}
        <div className="animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
          <ReceiptPreview data={receipt} />
        </div>

        {/* Quick action buttons */}
        <ReceiptViewClient />
      </div>
    </div>
  )
}
