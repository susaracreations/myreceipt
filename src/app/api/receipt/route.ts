import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const getFilePath = () => path.join(process.cwd(), "src", "data", "receipts.json")

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing receipt ID" }, { status: 400 })
    }

    const filePath = getFilePath()
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Receipt database not found" }, { status: 404 })
    }

    const data = fs.readFileSync(filePath, "utf-8")
    const receipts = JSON.parse(data || "{}")

    const receipt = receipts[id]
    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }

    return NextResponse.json(receipt)
  } catch (error) {
    console.error("Error fetching receipt:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      businessName,
      businessAddress,
      businessContact,
      businessLogoUrl,
      receiptNumber,
      isCustomReceiptNumber,
      receiptDate,
      receiptTime,
      customerName,
      customerPhone,
      paymentMethod,
      taxRate,
      taxType,
      discountRate,
      discountType,
      items,
    } = body

    // Fallback if receipt number is somehow missing
    const id = receiptNumber || `REC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const filePath = getFilePath()
    let receipts: Record<string, any> = {}

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8")
      receipts = JSON.parse(fileContent || "{}")
    } else {
      const dirPath = path.dirname(filePath)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
    }

    const newReceipt = {
      id,
      businessName,
      businessAddress,
      businessContact,
      businessLogoUrl,
      receiptNumber,
      isCustomReceiptNumber,
      receiptDate,
      receiptTime,
      customerName,
      customerPhone,
      paymentMethod,
      taxRate: parseFloat(taxRate) || 0,
      taxType: taxType || "percentage",
      discountRate: parseFloat(discountRate) || 0,
      discountType: discountType || "percentage",
      items: Array.isArray(items) ? items : [],
      createdAt: new Date().toISOString(),
    }

    receipts[id] = newReceipt
    fs.writeFileSync(filePath, JSON.stringify(receipts, null, 2), "utf-8")

    return NextResponse.json({ success: true, id, receipt: newReceipt })
  } catch (error) {
    console.error("Error creating receipt:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
