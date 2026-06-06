"use client"

import React, { useState, useEffect, useRef } from "react"
import { ReceiptData, ReceiptItem } from "@/types/receipt"
import { ReceiptForm } from "./receipt-form"
import { ReceiptPreview } from "./receipt-preview"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { 
  Printer, 
  Image as ImageIcon, 
  Share2, 
  Copy, 
  Check, 
  Edit,
  Eye,
  Trash2
} from "lucide-react"

const DEFAULT_BUSINESS_NAME = "Susara Creations"
const DEFAULT_BUSINESS_ADDRESS = "Colombo, Sri Lanka"
const DEFAULT_BUSINESS_CONTACT = "0716843378 | susarastreams@gmail.com"
const DEFAULT_TAX_RATE = 0
const DEFAULT_DISCOUNT_RATE = 0
const DEFAULT_ITEMS: ReceiptItem[] = [
  { id: 1, description: "Product A", quantity: 1, unitPrice: 1000 },
  { id: 2, description: "Service B", quantity: 2, unitPrice: 500 },
]

export function ReceiptGenerator() {
  const [data, setData] = useState<ReceiptData | null>(null)
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedData = localStorage.getItem("receiptAppData")
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, "0")
    const min = String(now.getMinutes()).padStart(2, "0")
    const dd = String(now.getDate()).padStart(2, "0")
    const mm = String(now.getMonth() + 1).padStart(2, "0")
    const yyyy = now.getFullYear()
    
    const defaultDate = `${yyyy}-${mm}-${dd}`
    const defaultTime = `${hh}:${min}`

    let initialData: ReceiptData

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        initialData = {
          businessName: parsed.businessName || DEFAULT_BUSINESS_NAME,
          businessAddress: parsed.businessAddress || DEFAULT_BUSINESS_ADDRESS,
          businessContact: parsed.businessContact || DEFAULT_BUSINESS_CONTACT,
          businessLogoUrl: parsed.businessLogoUrl || "",
          receiptNumber: parsed.receiptNumber || "",
          isCustomReceiptNumber: parsed.isCustomReceiptNumber || false,
          receiptDate: parsed.receiptDate || defaultDate,
          receiptTime: parsed.receiptTime || defaultTime,
          customerName: parsed.customerName || "",
          customerPhone: parsed.customerPhone || "",
          paymentMethod: parsed.paymentMethod || "Cash",
          taxRate: parsed.taxRate ?? DEFAULT_TAX_RATE,
          taxType: parsed.taxType || "percentage",
          discountRate: parsed.discountRate ?? DEFAULT_DISCOUNT_RATE,
          discountType: parsed.discountType || "percentage",
          items: parsed.items || DEFAULT_ITEMS,
        }
      } catch (e) {
        console.error("Error parsing saved data", e)
        initialData = createDefaultData(defaultDate, defaultTime)
      }
    } else {
      initialData = createDefaultData(defaultDate, defaultTime)
    }

    if (!initialData.isCustomReceiptNumber && !initialData.receiptNumber) {
      initialData.receiptNumber = getNextReceiptNumber()
    }

    setData(initialData)
  }, [])

  useEffect(() => {
    if (data) {
      localStorage.setItem("receiptAppData", JSON.stringify(data))
    }
  }, [data])

  const createDefaultData = (date: string, time: string): ReceiptData => {
    return {
      businessName: DEFAULT_BUSINESS_NAME,
      businessAddress: DEFAULT_BUSINESS_ADDRESS,
      businessContact: DEFAULT_BUSINESS_CONTACT,
      businessLogoUrl: "",
      receiptNumber: "",
      isCustomReceiptNumber: false,
      receiptDate: date,
      receiptTime: time,
      customerName: "",
      customerPhone: "",
      paymentMethod: "Cash",
      taxRate: DEFAULT_TAX_RATE,
      taxType: "percentage",
      discountRate: DEFAULT_DISCOUNT_RATE,
      discountType: "percentage",
      items: DEFAULT_ITEMS,
    }
  }

  const getNextReceiptNumber = () => {
    const lastNum = localStorage.getItem("lastReceiptNumber")
    const nextNum = lastNum ? parseInt(lastNum) + 1 : 1
    return `REC-${String(nextNum).padStart(6, "0")}`
  }

  const handleDataChange = (newData: ReceiptData) => {
    if (data && !data.isCustomReceiptNumber && newData.isCustomReceiptNumber) {
      // Switched to custom, leave as is
    } else if (data && data.isCustomReceiptNumber && !newData.isCustomReceiptNumber) {
      newData.receiptNumber = getNextReceiptNumber()
    }
    setData(newData)
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all fields to default?")) {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, "0")
      const min = String(now.getMinutes()).padStart(2, "0")
      const dd = String(now.getDate()).padStart(2, "0")
      const mm = String(now.getMonth() + 1).padStart(2, "0")
      const yyyy = now.getFullYear()
      
      const defaultDate = `${yyyy}-${mm}-${dd}`
      const defaultTime = `${hh}:${min}`

      const resetData = createDefaultData(defaultDate, defaultTime)
      resetData.receiptNumber = getNextReceiptNumber()
      setData(resetData)
    }
  }

  const handlePrint = () => {
    if (!data) return
    const printContents = document.getElementById("receiptPrintArea")?.innerHTML
    if (!printContents) return

    const printWindow = window.open("", "_blank", "height=600,width=800")
    if (!printWindow) return

    printWindow.document.write("<html><head><title>Receipt " + data.receiptNumber + "</title>")
    printWindow.document.write("<script src='https://cdn.tailwindcss.com'></script>")
    printWindow.document.write("<style>")
    printWindow.document.write(`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght=300;400;500;600;700&display=swap');
      body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; box-sizing: border-box; color: #333; }
      .print-area { width: 100%; }
      .receipt-logo { max-width: 150px; height: auto; margin-bottom: 1rem; }
    `)
    printWindow.document.write("</style>")
    printWindow.document.write("</head><body>")
    printWindow.document.write(printContents)
    printWindow.document.write("</body></html>")
    printWindow.document.close()

    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
      }, 500)
    }
  }

  const handleDownloadPng = async () => {
    if (!data) return
    const html2canvas = (await import("html2canvas")).default
    const element = document.getElementById("receiptPrintArea")
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      })
      const imageDataURL = canvas.toDataURL("image/png")
      
      const link = document.createElement("a")
      link.href = imageDataURL
      link.download = `receipt-${data.receiptNumber}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      if (!data.isCustomReceiptNumber) {
        const currentReceiptNum = parseInt(data.receiptNumber.replace("REC-", ""))
        localStorage.setItem("lastReceiptNumber", currentReceiptNum.toString())
        setData({
          ...data,
          receiptNumber: `REC-${String(currentReceiptNum + 1).padStart(6, "0")}`
        })
      }
    } catch (error) {
      console.error("Error generating PNG:", error)
      alert("PNG generation failed. Please try Print Receipt (Browser Dialog) option.")
    }
  }

  const encodeReceiptData = (receipt: ReceiptData) => {
    const jsonStr = JSON.stringify(receipt)
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)))
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  }

  const handleShare = async () => {
    if (!data) return
    setIsSaving(true)
    
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    const origin = window.location.origin

    if (!isLocal) {
      // Deployed to production (Vercel, etc.). Use the URL-encoded link for guaranteed persistence
      try {
        const encoded = encodeReceiptData(data)
        setShareUrl(`${origin}/receipt/${encoded}`)
        setIsShareModalOpen(true)
      } catch (error) {
        console.error("Error encoding receipt:", error)
        alert("An error occurred while sharing the receipt.")
      } finally {
        setIsSaving(false)
      }
      return
    }

    // Local development: use the local JSON database API
    try {
      const response = await fetch("/api/receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        setShareUrl(`${origin}/receipt/${result.id}`)
        setIsShareModalOpen(true)
      } else {
        // Fallback if API fails locally
        const encoded = encodeReceiptData(data)
        setShareUrl(`${origin}/receipt/${encoded}`)
        setIsShareModalOpen(true)
      }
    } catch (error) {
      console.error("Error sharing receipt locally:", error)
      // Fallback
      const encoded = encodeReceiptData(data)
      setShareUrl(`${origin}/receipt/${encoded}`)
      setIsShareModalOpen(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-2">
          {/* Tabs for mobile screen layouts */}
          <div className="flex sm:hidden rounded-lg bg-muted p-1 border border-border">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "edit"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "preview"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>
          <span className="hidden sm:inline-flex text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-100 select-none">
            Workspace Mode
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="text-xs border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={isSaving}
            className="text-xs border-border text-foreground hover:bg-muted/50"
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            {isSaving ? "Saving..." : "Share Link"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs border-border text-foreground hover:bg-muted/50"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Print
          </Button>
          <Button
            variant="action"
            size="sm"
            onClick={handleDownloadPng}
            className="text-xs"
          >
            <ImageIcon className="h-4 w-4 mr-1.5" />
            Download PNG
          </Button>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className={`lg:col-span-7 ${activeTab === "edit" ? "block" : "hidden lg:block"}`}>
          <ReceiptForm data={data} onChange={handleDataChange} />
        </div>

        {/* Live Preview Column */}
        <div className={`lg:col-span-5 ${activeTab === "preview" ? "block" : "hidden lg:block"} lg:sticky lg:top-8 self-start`}>
          <div className="space-y-4">
            <h3 className="hidden lg:block text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1 select-none">Live Receipt Preview</h3>
            <ReceiptPreview data={data} ref={previewRef} />
          </div>
        </div>
      </div>

      {/* Share Link Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Shareable Link Generated"
        description="Provide your clients with this direct, print-friendly URL to verify their payment."
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="font-mono text-xs select-all bg-muted/50"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              className="shrink-0 cursor-pointer"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {copied ? "Link copied to clipboard!" : "Copy this URL to send it to your customer."}
          </p>
          <div className="pt-4 border-t border-border flex justify-end">
            <Button onClick={() => setIsShareModalOpen(false)} className="cursor-pointer">
              Close Window
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
