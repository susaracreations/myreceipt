export interface ReceiptItem {
  id: string | number
  description: string
  quantity: number
  unitPrice: number
}

export interface ReceiptData {
  businessName: string
  businessAddress: string
  businessContact: string
  businessLogoUrl: string
  receiptNumber: string
  isCustomReceiptNumber: boolean
  receiptDate: string
  receiptTime: string
  customerName: string
  customerPhone: string
  paymentMethod: string
  taxRate: number
  taxType?: "percentage" | "fixed"
  discountRate?: number
  discountType?: "percentage" | "fixed"
  items: ReceiptItem[]
}
