import { useEffect, useRef } from "react"

export function OverviewChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Chart dimensions
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Sample data - queries per day for the last 30 days
    const data = [
      65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 85, 90, 95, 100, 110, 120, 115, 105, 95, 85, 75, 65, 70, 80, 90, 100, 110,
      120, 130, 140,
    ]

    // Calculate scale
    const maxValue = Math.max(...data)
    const yScale = chartHeight / maxValue
    const xScale = chartWidth / (data.length - 1)

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0" // Tailwind slate-200
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw y-axis labels
    ctx.fillStyle = "#64748b" // Tailwind slate-500
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    const yLabelCount = 5
    for (let i = 0; i <= yLabelCount; i++) {
      const y = height - padding - (i * chartHeight) / yLabelCount
      const value = Math.round((i * maxValue) / yLabelCount)
      ctx.fillText(value.toString(), padding - 10, y)

      // Draw horizontal grid lines
      ctx.beginPath()
      ctx.strokeStyle = "#e2e8f0" // Tailwind slate-200
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw x-axis labels (every 5 days)
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    for (let i = 0; i < data.length; i += 5) {
      const x = padding + i * xScale
      ctx.fillText((i + 1).toString(), x, height - padding + 10)
    }

    // Draw line chart
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6" // Tailwind blue-500
    ctx.lineWidth = 2

    // Start at the first data point
    ctx.moveTo(padding, height - padding - data[0] * yScale)

    // Connect to each subsequent data point
    for (let i = 1; i < data.length; i++) {
      const x = padding + i * xScale
      const y = height - padding - data[i] * yScale
      ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Add gradient fill under the line
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.2)") // Tailwind blue-500 with opacity
    gradient.addColorStop(1, "rgba(59, 130, 246, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(padding, height - padding - data[0] * yScale)

    for (let i = 1; i < data.length; i++) {
      const x = padding + i * xScale
      const y = height - padding - data[i] * yScale
      ctx.lineTo(x, y)
    }

    // Complete the path to create a closed shape for filling
    ctx.lineTo(padding + (data.length - 1) * xScale, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.closePath()
    ctx.fill()

    // Draw data points
    ctx.fillStyle = "#ffffff" // White
    ctx.strokeStyle = "#3b82f6" // Tailwind blue-500
    ctx.lineWidth = 2

    for (let i = 0; i < data.length; i++) {
      const x = padding + i * xScale
      const y = height - padding - data[i] * yScale

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} width={800} height={300} className="h-full w-full" />
    </div>
  )
}
