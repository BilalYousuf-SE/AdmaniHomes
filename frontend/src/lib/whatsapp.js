export function whatsappLink(number, message = '') {
  const digits = (number || '').replace(/[^0-9]/g, '')
  if (!/^[0-9]{7,15}$/.test(digits)) return null
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
