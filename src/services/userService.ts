const API_BASE_URL = 'https://api-test-production-ccbf.up.railway.app/api'

interface BackendUser {
  _id: string
  name: string
  email: string
  role: string
  token: string
}

export async function ensureBackendUser(email: string, name: string): Promise<BackendUser> {
  // helper to POST json
  const postJson = async (url: string, body: any) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    return { res, json }
  }

  // 1. coba login
  const { res: loginRes, json: loginJson } = await postJson(`${API_BASE_URL}/users/login`, {
    email,
    password: email, // password dummy sama dgn email
  })
  if (loginRes.ok && loginJson.success) {
    return loginJson.data as BackendUser
  }

  // 2. kalau gagal, coba register
  await postJson(`${API_BASE_URL}/users/register`, {
    name,
    email,
    password: email,
  })

  // 3. login ulang
  const { json: loginAgain } = await postJson(`${API_BASE_URL}/users/login`, {
    email,
    password: email,
  })
  if (!loginAgain.success) throw new Error(loginAgain.message || 'Login backend gagal')
  return loginAgain.data as BackendUser
} 