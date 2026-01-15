import { useEffect, useRef, forwardRef } from 'react'
import './Wheel.css'

interface WheelProps {
    items: string[]
    selectedIndex: number | null
    isSpinning: boolean
    onSpin: () => void
}

const Wheel = forwardRef<HTMLCanvasElement, WheelProps>(
    ({ items, selectedIndex, isSpinning, onSpin }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null)
        const rotationRef = useRef(0)
        const animationRef = useRef<number | null>(null)

        const drawWheel = (rotation: number = 0) => {
            const canvas = canvasRef.current
            if (!canvas || items.length === 0) return

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            const width = canvas.width
            const height = canvas.height
            const centerX = width / 2
            const centerY = height / 2
            const radius = Math.min(width, height) / 2 - 10

            // Clear canvas
            ctx.fillStyle = '#f5f5f5'
            ctx.fillRect(0, 0, width, height)

            // Draw wheel
            const sliceAngle = (2 * Math.PI) / items.length
            const colors = generateColors(items.length)

            ctx.save()
            ctx.translate(centerX, centerY)
            ctx.rotate(rotation)

            for (let i = 0; i < items.length; i++) {
                // Draw slice
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.arc(0, 0, radius, i * sliceAngle, (i + 1) * sliceAngle)
                ctx.lineTo(0, 0)
                ctx.fillStyle = colors[i]
                ctx.fill()
                ctx.strokeStyle = '#fff'
                ctx.lineWidth = 2
                ctx.stroke()

                // Draw text
                ctx.save()
                ctx.rotate(i * sliceAngle + sliceAngle / 2)
                ctx.textAlign = 'right'
                ctx.fillStyle = '#fff'
                ctx.font = 'bold 14px Arial'
                ctx.fillText(items[i], radius - 30, 5)
                ctx.restore()
            }

            ctx.restore()

            // Draw center circle
            ctx.beginPath()
            ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI)
            ctx.fillStyle = '#fff'
            ctx.fill()
            ctx.strokeStyle = '#333'
            ctx.lineWidth = 3
            ctx.stroke()

            ctx.fillStyle = '#333'
            ctx.font = 'bold 18px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('QUAY', centerX, centerY)

            // Draw pointer
            ctx.fillStyle = '#FF6B6B'
            ctx.beginPath()
            ctx.moveTo(centerX, 20)
            ctx.lineTo(centerX - 10, 40)
            ctx.lineTo(centerX + 10, 40)
            ctx.closePath()
            ctx.fill()
        }

        const generateColors = (count: number): string[] => {
            const colors = [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
                '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6'
            ]
            const result: string[] = []
            for (let i = 0; i < count; i++) {
                result.push(colors[i % colors.length])
            }
            return result
        }

        const spinWheel = () => {
            if (isSpinning || items.length === 0) return

            let duration = 2000 // 2 seconds
            let startTime: number
            rotationRef.current = 0

            const animate = (currentTime: number) => {
                if (!startTime) startTime = currentTime
                const elapsed = currentTime - startTime

                if (elapsed < duration) {
                    // Easing out cubic
                    const progress = elapsed / duration
                    const easeProgress = 1 - Math.pow(1 - progress, 3)

                    // Spin 5 times plus random amount
                    const totalRotation = 10 * Math.PI + (selectedIndex !== null ? (selectedIndex * 2 * Math.PI) / items.length : 0)
                    rotationRef.current = totalRotation * easeProgress

                    drawWheel(rotationRef.current)
                    animationRef.current = requestAnimationFrame(animate)
                } else {
                    // Final rotation
                    const sliceAngle = (2 * Math.PI) / items.length
                    const finalRotation = selectedIndex !== null
                        ? -selectedIndex * sliceAngle + Math.PI / 2
                        : 0
                    rotationRef.current = finalRotation
                    drawWheel(rotationRef.current)
                }
            }

            animationRef.current = requestAnimationFrame(animate)
            onSpin()
        }

        useEffect(() => {
            drawWheel(rotationRef.current)
            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current)
                }
            }
        }, [items])

        return (
            <div className="wheel-container">
                <canvas
                    ref={canvasRef}
                    className={`wheel-canvas ${isSpinning ? 'spinning' : ''}`}
                    width={600}
                    height={600}
                    onClick={spinWheel}
                    style={{ cursor: isSpinning ? 'not-allowed' : 'pointer' }}
                />
                <button
                    className="spin-button"
                    onClick={spinWheel}
                    disabled={isSpinning || items.length === 0}
                >
                    {isSpinning ? '⏳ Đang quay...' : '🎯 Bấm để quay'}
                </button>
            </div>
        )
    }
)

Wheel.displayName = 'Wheel'

export default Wheel
