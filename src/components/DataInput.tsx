import { useState } from 'react'
import './DataInput.css'

interface DataInputProps {
    onAddItem: (item: string) => void
}

export default function DataInput({ onAddItem }: DataInputProps) {
    const [input, setInput] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            onAddItem(input)
            setInput('')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit(e as any)
        }
    }

    return (
        <form className="data-input" onSubmit={handleSubmit}>
            <h3>Thêm mục mới</h3>
            <div className="input-group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập mục (Enter để thêm)"
                    maxLength={50}
                />
                <button type="submit" disabled={!input.trim()}>
                    ➕ Thêm
                </button>
            </div>
            <p className="input-help">Mỗi dòng nhập = 1 mục trong vòng quay</p>
        </form>
    )
}
