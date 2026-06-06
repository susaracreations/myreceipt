"use client"

import React from "react"
import { ReceiptData, ReceiptItem } from "@/types/receipt"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Plus, Trash2, Percent, AlertCircle } from "lucide-react"

interface ReceiptFormProps {
  data: ReceiptData
  onChange: (data: ReceiptData) => void
}

export function ReceiptForm({ data, onChange }: ReceiptFormProps) {
  const handleFieldChange = (field: keyof ReceiptData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  const handleItemChange = (itemId: string | number, field: keyof ReceiptItem, value: any) => {
    const updatedItems = data.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          [field]: field === "description" ? value : parseFloat(value) || 0,
        }
      }
      return item
    })
    handleFieldChange("items", updatedItems)
  }

  const handleAddItem = () => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
    }
    handleFieldChange("items", [...data.items, newItem])
  }

  const handleRemoveItem = (itemId: string | number) => {
    const updatedItems = data.items.filter((item) => item.id !== itemId)
    handleFieldChange("items", updatedItems)
  }

  return (
    <div className="space-y-6">
      {/* Business Details Section */}
      <div className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xs">
        <h3 className="text-lg font-semibold text-purple-600 border-b border-border pb-2">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Business Name</label>
            <Input
              value={data.businessName}
              onChange={(e) => handleFieldChange("businessName", e.target.value)}
              placeholder="e.g. Susara Creations"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Address</label>
            <Input
              value={data.businessAddress}
              onChange={(e) => handleFieldChange("businessAddress", e.target.value)}
              placeholder="e.g. Colombo, Sri Lanka"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Phone / Email</label>
            <Input
              value={data.businessContact}
              onChange={(e) => handleFieldChange("businessContact", e.target.value)}
              placeholder="e.g. 0716843378 | email@domain.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Business Logo URL (Optional)</label>
            <Input
              value={data.businessLogoUrl}
              onChange={(e) => handleFieldChange("businessLogoUrl", e.target.value)}
              placeholder="e.g. https://domain.com/logo.png"
            />
          </div>
        </div>
      </div>

      {/* Receipt Details Section */}
      <div className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xs">
        <h3 className="text-lg font-semibold text-purple-600 border-b border-border pb-2">Receipt Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Receipt Number</label>
            <Input
              value={data.receiptNumber}
              onChange={(e) => handleFieldChange("receiptNumber", e.target.value)}
              disabled={!data.isCustomReceiptNumber}
              className={!data.isCustomReceiptNumber ? "bg-muted/50 cursor-not-allowed opacity-80" : ""}
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="customReceiptNumberToggle"
                checked={data.isCustomReceiptNumber}
                onChange={(e) => handleFieldChange("isCustomReceiptNumber", e.target.checked)}
                className="h-4 w-4 rounded border-border text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="customReceiptNumberToggle" className="text-xs text-muted-foreground cursor-pointer select-none">
                Custom Receipt Number
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Date</label>
            <Input
              type="date"
              value={data.receiptDate}
              onChange={(e) => handleFieldChange("receiptDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Time</label>
            <Input
              type="time"
              value={data.receiptTime}
              onChange={(e) => handleFieldChange("receiptTime", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Customer Name (Optional)</label>
            <Input
              value={data.customerName}
              onChange={(e) => handleFieldChange("customerName", e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Customer Phone (Optional)</label>
            <Input
              value={data.customerPhone}
              onChange={(e) => handleFieldChange("customerPhone", e.target.value)}
              placeholder="e.g. 0771234567"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-purple-600">Items Table</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleAddItem}
            className="flex items-center gap-1 text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {data.items.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg text-muted-foreground">
            <AlertCircle className="mx-auto h-8 w-8 opacity-40 mb-2" />
            <p className="text-sm">No items added yet. Click &quot;Add Item&quot; to begin.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2 w-20 text-center">Qty</th>
                  <th className="py-3 px-2 w-28">Unit Price</th>
                  <th className="py-3 px-2 w-28 text-right">Total</th>
                  <th className="py-3 px-2 w-12 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((item) => (
                  <tr key={item.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-2">
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        placeholder="Item description"
                        className="h-9"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                        className="h-9 text-center"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, "unitPrice", e.target.value)}
                        className="h-9"
                      />
                    </td>
                    <td className="py-2 px-2 text-right font-medium text-sm pr-4">
                      Rs. {(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors p-1.5 rounded-md hover:bg-destructive/10 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Totals & Payment Section */}
      <div className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xs">
        <h3 className="text-lg font-semibold text-purple-600 border-b border-border pb-2">Totals &amp; Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Tax</label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Input
                  type="number"
                  min="0"
                  max={data.taxType === "fixed" ? undefined : 100}
                  step="any"
                  value={data.taxRate}
                  onChange={(e) => handleFieldChange("taxRate", parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
                <span className="absolute left-3 top-2 text-muted-foreground text-xs font-semibold select-none">
                  {(data.taxType || "percentage") === "percentage" ? "%" : "Rs."}
                </span>
              </div>
              <Select
                value={data.taxType || "percentage"}
                onChange={(e) => handleFieldChange("taxType", e.target.value)}
                className="w-36 shrink-0"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (Rs.)</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Discount</label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Input
                  type="number"
                  min="0"
                  max={data.discountType === "fixed" ? undefined : 100}
                  step="any"
                  value={data.discountRate || 0}
                  onChange={(e) => handleFieldChange("discountRate", parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
                <span className="absolute left-3 top-2 text-muted-foreground text-xs font-semibold select-none">
                  {(data.discountType || "percentage") === "percentage" ? "%" : "Rs."}
                </span>
              </div>
              <Select
                value={data.discountType || "percentage"}
                onChange={(e) => handleFieldChange("discountType", e.target.value)}
                className="w-36 shrink-0"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (Rs.)</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Payment Method</label>
            <Select
              value={data.paymentMethod}
              onChange={(e) => handleFieldChange("paymentMethod", e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Mobile Payment">Mobile Payment</option>
              <option value="Dialog EZ Cash">Dialog EZ Cash</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
