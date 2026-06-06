import React, { forwardRef } from "react"
import { ReceiptData } from "@/types/receipt"

interface ReceiptPreviewProps {
  data: ReceiptData
}

export const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ data }, ref) => {
    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    
    const isDiscountPercentage = (data.discountType || "percentage") === "percentage"
    const discountRate = data.discountRate || 0
    const discountAmount = isDiscountPercentage
      ? subtotal * (discountRate / 100)
      : discountRate

    const isTaxPercentage = (data.taxType || "percentage") === "percentage"
    const taxRate = data.taxRate || 0
    const taxAmount = isTaxPercentage 
      ? subtotal * (taxRate / 100) 
      : taxRate

    const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount)

    return (
      <div
        ref={ref}
        id="receiptPrintArea"
        className="w-full max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs print-area text-slate-800 font-sans"
      >
        {/* Logo and Header */}
        <div className="text-center mb-6">
          {data.businessLogoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.businessLogoUrl}
              alt="Logo"
              className="max-h-16 mx-auto mb-4 object-contain"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = "none"
              }}
            />
          )}
          <h2 className="text-2xl sm:text-3xl font-semibold text-purple-700 leading-tight">
            {data.businessName || "Your Business Name"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {data.businessAddress || "Business Address"}
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            {data.businessContact || "Phone / Email"}
          </p>
          <div className="border-b-2 border-purple-100 dark:border-purple-950 mt-4" />
        </div>

        {/* Receipt Meta */}
        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm mb-6 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <p className="text-slate-500">
              Receipt No: <span className="font-semibold text-slate-800">{data.receiptNumber}</span>
            </p>
            <p className="text-slate-500">
              Date: <span className="font-semibold text-slate-800">{data.receiptDate}</span>
            </p>
            <p className="text-slate-500">
              Time: <span className="font-semibold text-slate-800">{data.receiptTime}</span>
            </p>
          </div>
          <div className="text-right space-y-1">
            {data.customerName && (
              <p className="text-slate-500">
                Customer: <span className="font-semibold text-slate-800">{data.customerName}</span>
              </p>
            )}
            {data.customerPhone && (
              <p className="text-slate-500">
                Phone: <span className="font-semibold text-slate-800">{data.customerPhone}</span>
              </p>
            )}
            <p className="text-slate-500">
              Payment: <span className="font-semibold text-slate-800">{data.paymentMethod}</span>
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2 w-1/2">Description</th>
                <th className="py-2 text-center w-12">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right pr-1">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {data.items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                    No items listed
                  </td>
                </tr>
              ) : (
                data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-3 pr-2 font-medium text-slate-800 break-words">
                      {item.description || "Unnamed Item"}
                    </td>
                    <td className="py-3 text-center text-slate-500">{item.quantity}</td>
                    <td className="py-3 text-right text-slate-500">Rs. {item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 text-right font-medium text-slate-800 pr-1">
                      Rs. {(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex flex-col items-end text-xs sm:text-sm space-y-1.5 border-t border-slate-100 pt-4">
          <div className="flex justify-between w-48 text-slate-500">
            <span>Subtotal:</span>
            <span className="font-medium text-slate-800">Rs. {subtotal.toFixed(2)}</span>
          </div>
          {discountRate > 0 && (
            <div className="flex justify-between w-48 text-slate-500">
              <span>Discount ({isDiscountPercentage ? `${discountRate}%` : "Flat"}):</span>
              <span className="font-medium text-rose-600">-Rs. {discountAmount.toFixed(2)}</span>
            </div>
          )}
          {taxRate > 0 && (
            <div className="flex justify-between w-48 text-slate-500">
              <span>Tax ({isTaxPercentage ? `${taxRate}%` : "Flat"}):</span>
              <span className="font-medium text-slate-800">Rs. {taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between w-48 text-base font-semibold text-purple-800 border-t border-purple-100 pt-2 mt-2">
            <span>Total:</span>
            <span>Rs. {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 pt-6 border-t border-slate-100 text-[10px] sm:text-xs text-slate-400 space-y-1">
          <p className="font-medium text-slate-500">Thank you for your business!</p>
          <p>We look forward to serving you again.</p>
          <p className="text-[9px] text-slate-300 mt-2">
            This is a computer-generated receipt. No signature is required.
          </p>
        </div>
      </div>
    )
  }
)

ReceiptPreview.displayName = "ReceiptPreview"
