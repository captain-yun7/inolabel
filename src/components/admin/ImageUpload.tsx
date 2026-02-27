'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import styles from './ImageUpload.module.css'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  folder?: string
  size?: number
}

export function ImageUpload({
  value,
  onChange,
  folder = 'members',
  size = 80,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      let url: string

      if (file.size > 4 * 1024 * 1024) {
        // 4MB 초과: Presigned URL로 직접 업로드
        const params = new URLSearchParams({ folder, filename: file.name, contentType: file.type })
        const urlRes = await fetch(`/api/upload?${params}`)
        if (!urlRes.ok) throw new Error('업로드 URL 발급 실패')
        const { uploadUrl, publicUrl } = await urlRes.json()
        const putRes = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
        if (!putRes.ok) throw new Error('이미지 업로드 실패')
        url = publicUrl
      } else {
        // 4MB 이하: 서버 경유
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)
        const response = await fetch('/api/upload', { method: 'POST', body: formData })
        const text = await response.text()
        let data
        try { data = JSON.parse(text) } catch { throw new Error(response.status === 413 ? '파일이 너무 큽니다.' : '서버 오류') }
        if (!response.ok) throw new Error(data.error || '업로드 실패')
        url = data.url
      }

      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패')
    } finally {
      setIsUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.preview}
        style={{ width: size, height: size }}
      >
        {isUploading ? (
          <div className={styles.uploading}>
            <Loader2 size={24} className={styles.spinner} />
          </div>
        ) : value ? (
          <>
            <Image
              src={value}
              alt="업로드된 이미지"
              fill
              style={{ objectFit: 'cover' }}
            />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={handleRemove}
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div
            className={styles.placeholder}
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={20} />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.input}
        disabled={isUploading}
      />

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
