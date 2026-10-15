import { getRussianPhoneDigits } from './phone'

// Existing request retained for the later backend integration. Preview forms do not call it.
export async function submitLead(formData: FormData) {
  const phoneDigits = getRussianPhoneDigits(String(formData.get('phone') ?? ''))
  const response = await fetch('/api/v1/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: formData.get('name'),
      phone: phoneDigits ? `+7${phoneDigits}` : '',
      consent: formData.get('consent') === 'on',
    }),
  })

  if (!response.ok) {
    throw new Error('Lead request failed')
  }
}
