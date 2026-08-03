import { useRef, useState } from 'react'
import { uploadToCloudinary, isVideoUrl } from '../api/upload.js'

/**
 * Multi-file image/video uploader. Manages a list of already-uploaded
 * media URLs and lets the admin add more or remove existing ones.
 *
 * Props:
 *  - value: string[] of media URLs
 *  - onChange: (nextUrls: string[]) => void
 *  - accept: input accept attribute (default images+video)
 *  - maxFiles: optional cap
 */
export default function MediaUploader({ value = [], onChange, accept = 'image/*,video/*', maxFiles }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState([]) // [{ id, name, progress, error }]

  async function handleFiles(fileList) {
    const files = Array.from(fileList)
    if (maxFiles && value.length + files.length > maxFiles) {
      alert(`You can only have up to ${maxFiles} files.`)
      return
    }

    for (const file of files) {
      const id = `${file.name}-${Date.now()}-${Math.random()}`
      setUploading((prev) => [...prev, { id, name: file.name, progress: 0, error: null }])

      try {
        const { url } = await uploadToCloudinary(file, (percent) => {
          setUploading((prev) => prev.map((u) => (u.id === id ? { ...u, progress: percent } : u)))
        })
        onChange([...value, url])
      } catch (err) {
        setUploading((prev) => prev.map((u) => (u.id === id ? { ...u, error: err.message } : u)))
        continue
      } finally {
        setUploading((prev) => prev.filter((u) => u.id !== id || u.error))
      }
    }
  }

  function handleRemove(url) {
    onChange(value.filter((u) => u !== url))
  }

  function handleDrop(e) {
    e.preventDefault()
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="media-uploader">
      <div
        className="media-uploader__dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files)
            e.target.value = '' // allow re-selecting the same file later
          }}
        />
        <p>Click or drag photos/videos here to upload</p>
        <p className="media-uploader__hint">Images up to 10MB, videos up to 100MB</p>
      </div>

      {uploading.length > 0 && (
        <ul className="media-uploader__progress-list">
          {uploading.map((u) => (
            <li key={u.id}>
              {u.error ? (
                <span className="field-error">{u.name}: {u.error}</span>
              ) : (
                <span>{u.name} — {u.progress}%</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {value.length > 0 && (
        <div className="media-uploader__grid">
          {value.map((url) => (
            <div className="media-uploader__item" key={url}>
              {isVideoUrl(url) ? (
                <video src={url} muted />
              ) : (
                <img src={url} alt="" />
              )}
              <button type="button" onClick={() => handleRemove(url)} aria-label="Remove">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
