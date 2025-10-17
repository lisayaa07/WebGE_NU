// src/composables/useAuth.js
import { reactive } from 'vue'

export const authState = reactive({
  user: null,
  ready: false, // true เมื่อ fetch /api/me เสร็จ (ไม่ว่าจะสำเร็จหรือไม่)
})

export async function fetchMe() {
  try {
    const res = await fetch('/api/me', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) {
      authState.user = null
      return null
    }
    const data = await res.json()
    authState.user = data?.user ?? null
    return authState.user
  } catch (e) {
    console.error('fetchMe error', e)
    authState.user = null
    return null
  } finally {
    authState.ready = true
  }
}

export async function login(email, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Login failed')
  // update local state by calling fetchMe (safer)
  await fetchMe()
  return data
}

export async function logout() {
  try {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    console.warn('logout request failed', e)
  } finally {
    authState.user = null
  }
}
