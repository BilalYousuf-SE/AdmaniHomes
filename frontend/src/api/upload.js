import api from './api.js'

/**
 * Uploads a single file (image or video) directly to Cloudinary.
 * Flow: ask our backend for a short-lived signature -> POST the file
 * straight to Cloudinary's own endpoint. Our server never touches the
 * file bytes, which is what keeps this safe on a memory-limited host.
 *
 * @param {File} file
 * @param {(percent: number) => void} [onProgress]
 * @returns {Promise<{url: string, resourceType: string}>}
 */
export async function uploadToCloudinary(file, onProgress) {
  const sigRes = await api.get('/api/admin/upload/signature')
  const { signature, timestamp, apiKey, cloudName, folder } = sigRes.data

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', apiKey)
  formData.append('timestamp', timestamp)
  formData.append('signature', signature)
  formData.append('folder', folder)

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uploadUrl)

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText)
        resolve({ url: data.secure_url, resourceType: data.resource_type })
      } else {
        reject(new Error('Upload failed. Please try again.'))
      }
    }
    xhr.onerror = () => reject(new Error('Upload failed. Check your connection and try again.'))

    xhr.send(formData)
  })
}

export function isVideoUrl(url) {
  return /\.(mp4|mov|webm|m4v)$/i.test(url || '')
}
