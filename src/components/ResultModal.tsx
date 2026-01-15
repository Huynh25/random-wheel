import './ResultModal.css'

interface ResultModalProps {
    result: string
    onRemove: () => void
    onKeep: () => void
}

export default function ResultModal({ result, onRemove, onKeep }: ResultModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>🎉 Kết Quả Quay</h2>
                </div>
                <div className="modal-body">
                    <div className="result-box">
                        <p className="result-label">Bạn đã trúng:</p>
                        <p className="result-text">{result}</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-remove" onClick={onRemove}>
                        🗑️ Xóa khỏi vòng quay
                    </button>
                    <button className="btn-keep" onClick={onKeep}>
                        ✓ Giữ lại & quay lại
                    </button>
                </div>
            </div>
        </div>
    )
}
