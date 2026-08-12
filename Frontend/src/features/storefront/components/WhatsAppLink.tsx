export function WhatsAppLink() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '')

  if (!number || !/^55\d{10,11}$/.test(number) || /^550{10,11}$/.test(number)) {
    return null
  }

  return (
    <a
      className="whatsapp-link"
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a MS Griffe pelo WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3a12 12 0 0 0-10.3 18.1L4 28l7-1.8A12 12 0 1 0 16 3Zm0 21.7c-1.7 0-3.3-.4-4.8-1.2l-.4-.2-4.1 1.1 1.1-4-.3-.4A9.7 9.7 0 1 1 16 24.7Zm5.3-7.2c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.4.3-.7.1-2-.8-3.3-2.8-3.5-3.1-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.2 4.5 3.1 1.2 3.1.8 3.7.8.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z" />
      </svg>
    </a>
  )
}
