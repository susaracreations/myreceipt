"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Printer, Home } from "lucide-react"
import Link from "next/link"

export function ReceiptViewClient() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex justify-center gap-3 mt-8 hide-on-print">
      <Link href="/">
        <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
          <Home className="h-4 w-4" />
          Create New
        </Button>
      </Link>
      <Button onClick={handlePrint} variant="print" className="flex items-center gap-2 cursor-pointer shadow-md">
        <Printer className="h-4 w-4" />
        Print Receipt
      </Button>
    </div>
  )
}
