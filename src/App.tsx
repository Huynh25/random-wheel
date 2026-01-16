import { useState, useRef } from 'react'
import './App.css'
import Wheel from './components/Wheel'
import DataInput from './components/DataInput'
import ResultModal from './components/ResultModal'
import History from './components/History'

interface HistoryItem {
  result: string
  timestamp: string
}

const PRIORITY_NAMES = [
  'Quốc Tiến',
  'Hoàng Khang',
  'Khánh My',
  'Tường Vy',
  'Ngọc Hân',
  'Hồng Hoa',
  'Ngọc Như Ý',
  'Hoài Lâm'
]

function App() {
  const [items, setItems] = useState<string[]>([
    'Trâm Anh', 'Huỳnh Anh', 'Thiên Ân', 'Gia Bảo', 'Nhật Hào', 'Ngọc Hân',
    'Hồng Hoa', 'Khả Hân', 'Bảo Hân', 'Gia Hùng', 'Hoàng Khang', 'Ngô Khôi',
    'Nguyễn Khôi', 'Quốc Khôi', 'Hoài Lâm', 'Thảo My', 'Khánh My', 'Phương Nhi',
    'Minh Nhựt', 'Lộc Phát', 'Tấn Phát', 'Minh Khôi', 'Ngọc Quí', 'Tùng Quân',
    'Quốc Tiến', 'Quốc Tiến', 'Phương Trinh', 'Phương Trúc', 'Hồng Trung', 'Đa Vin',
    'Quốc Vĩ', 'Tường Vy', 'Ngọc Như Ý', 'Như Ý'
  ])
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [wonPriority, setWonPriority] = useState<Set<number>>(new Set())
  const wheelRef = useRef<HTMLCanvasElement>(null)

  const handleAddItem = (item: string) => {
    if (item.trim()) {
      setItems([...items, item.trim()])
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const getNextSpinIndex = () => {
    // Ưu tiên quay trúng các tên trong PRIORITY_NAMES chưa được quay
    const priorityIndexes = PRIORITY_NAMES
      .map(name => items.indexOf(name))
      .filter(index => index !== -1) // Chỉ lấy những tên có trong danh sách
      .filter(index => !wonPriority.has(index)) // Chỉ lấy những tên chưa quay trúng

    // Nếu còn tên ưu tiên chưa quay trúng, ưu tiên quay cái đó
    if (priorityIndexes.length > 0) {
      return priorityIndexes[Math.floor(Math.random() * priorityIndexes.length)]
    }

    // Nếu đã quay trúng hết những tên ưu tiên, thì quay random toàn bộ
    return Math.floor(Math.random() * items.length)
  }

  const handleSpin = () => {
    if (items.length === 0 || isSpinning) return

    setIsSpinning(true)
    const randomIndex = getNextSpinIndex()

    // Simulate spin animation
    setTimeout(() => {
      setSelectedIndex(randomIndex)
      setShowModal(true)
      setIsSpinning(false)

      // Cập nhật danh sách những cái tên đã quay trúng trong danh sách ưu tiên
      if (PRIORITY_NAMES.includes(items[randomIndex])) {
        setWonPriority(prev => new Set(prev).add(randomIndex))
      }

      // Add to history
      const newHistoryItem: HistoryItem = {
        result: items[randomIndex],
        timestamp: new Date().toLocaleTimeString('vi-VN')
      }
      setHistory([newHistoryItem, ...history])
    }, 2000)
  }

  const handleRemoveWinner = () => {
    if (selectedIndex !== null) {
      const newItems = items.filter((_, i) => i !== selectedIndex)
      setItems(newItems)
      // Reset priority tracking khi danh sách thay đổi
      setWonPriority(new Set())
      setShowModal(false)
      setSelectedIndex(null)
    }
  }

  const handleKeepWinner = () => {
    setShowModal(false)
    setSelectedIndex(null)
  }

  const handleClearHistory = () => {
    setHistory([])
  }
  const handleClearAllItems = () => {
    setItems([])
    setWonPriority(new Set())
  }
  return (
    <div className="app">
      <header className="app-header">
        <h1>🎡 Random Wheel</h1>
        <p>Vòng quay may mắn - Xác định vận may của bạn</p>
      </header>

      <div className="app-container">
        <div className="wheel-section">
          <Wheel
            items={items}
            selectedIndex={selectedIndex}
            isSpinning={isSpinning}
            onSpin={handleSpin}
            ref={wheelRef}
          />
        </div>

        <div className="right-section">
          <div className="input-section">
            <DataInput onAddItem={handleAddItem} />
            <div className="items-list">
              <h3>Danh sách ({items.length} mục)</h3>
              <div className="items-container">
                {items.length === 0 ? (
                  <p className="empty-message">Vui lòng thêm ít nhất 1 mục</p>
                ) : (
                  items.map((item, index) => (
                    <div key={index} className="item-row">
                      <span className="item-index">{index + 1}</span>
                      <span className="item-text">{item}</span>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(index)}
                        title="Xóa mục"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
              {items.length > 0 && (
                <button
                  className="clear-all-btn"
                  onClick={handleClearAllItems}
                  title="Xóa tất cả"
                >
                  🗑️ Xóa tất cả
                </button>
              )}
            </div>
          </div>

          <div className="history-section">
            <History
              items={history}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </div>

      {showModal && selectedIndex !== null && (
        <ResultModal
          result={items[selectedIndex]}
          onRemove={handleRemoveWinner}
          onKeep={handleKeepWinner}
        />
      )}
    </div>
  )
}

export default App
