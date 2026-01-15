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

function App() {
  const [items, setItems] = useState<string[]>([
    'Trầm Anh', 'Huỳnh Anh', 'Thiên Ân', 'Gia Bảo', 'Nhật Hào', 'Ngọc Hảo',
    'Hồng Hoa', 'Khả Hân', 'Bảo Hân', 'Gia Hùng', 'Hoàng Khang', 'Ngô Khôi',
    'Nguyễn Khôi', 'Quốc Khôi', 'Hoài Lâm', 'Thảo Mỹ', 'Khánh Mỹ', 'Phương Nhi',
    'Minh Nhật', 'Lộc Phát', 'Tấn Phát', 'Phước Thịnh', 'Ngọc Qůi', 'Tùng Quân',
    'Thiên Tâm', 'Quốc Tiến', 'Phương Trình', 'Phương Trúc', 'Hồng Trung', 'Đạ Vin',
    'Quốc Vĩ', 'Tường Vy', 'Ngọc Như Ỷ', 'Như Ý'
  ])
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const wheelRef = useRef<HTMLCanvasElement>(null)

  const handleAddItem = (item: string) => {
    if (item.trim()) {
      setItems([...items, item.trim()])
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleClearAllItems = () => {
    setItems([])
  }

  const handleSpin = () => {
    if (items.length === 0 || isSpinning) return

    setIsSpinning(true)
    const randomIndex = Math.floor(Math.random() * items.length)

    // Simulate spin animation
    setTimeout(() => {
      setSelectedIndex(randomIndex)
      setShowModal(true)
      setIsSpinning(false)

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
