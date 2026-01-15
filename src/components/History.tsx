import './History.css'

interface HistoryItem {
    result: string
    timestamp: string
}

interface HistoryProps {
    items: HistoryItem[]
    onClear: () => void
}

export default function History({ items, onClear }: HistoryProps) {
    return (
        <div className="history">
            <div className="history-header">
                <h3>📝 Lịch Sử Quay ({items.length})</h3>
                {items.length > 0 && (
                    <button className="clear-btn" onClick={onClear} title="Xóa lịch sử">
                        ✕
                    </button>
                )}
            </div>
            <div className="history-list">
                {items.length === 0 ? (
                    <p className="empty-history">Chưa có lịch sử quay</p>
                ) : (
                    items.map((item, index) => (
                        <div key={index} className="history-item">
                            <span className="history-number">{index + 1}</span>
                            <div className="history-content">
                                <p className="history-result">{item.result}</p>
                                <p className="history-time">{item.timestamp}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
