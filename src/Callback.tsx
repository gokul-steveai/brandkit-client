import { useEffect, useState, useRef } from "react"

const statusMapping = {
    'in-progress': { message: 'Connecting BrandKit...', color: 'gray' },
    'success': { message: 'Authenticated Successfully', color: 'green' },
    'error': { message: 'Authentication Failed', color: 'red' }
}

function Callback() {
    const [status, setStatus] = useState<keyof typeof statusMapping>('in-progress')
    const hasExchanged = useRef(false)

    useEffect(() => {
        // Prevent double execution in React StrictMode
        if (hasExchanged.current) return
        hasExchanged.current = true

        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")
        const clientId = params.get("client_id") || sessionStorage.getItem('oauth_client_id')

        if (code && clientId) {
            exchangeCodeForToken(code, clientId)
        } else {
            setStatus('error')
            statusMapping['error'].message = code ? 'Client ID not found' : 'No authorization code found'
        }

    }, [])

    async function exchangeCodeForToken(code: string, clientId: string) {
        const tokenUrl = import.meta.env.VITE_TOKEN_URL || "https://hizoxwyykgxtmfvqzwyc.supabase.co/functions/v1/oauth-token"
        const codeVerifier = sessionStorage.getItem('code_verifier')
        
        try {
            const res = await fetch(tokenUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: code,
                    client_id: clientId,
                    grant_type: 'authorization_code',
                    code_verifier: codeVerifier
                })
            })

            const data = await res.json()
            if (res.ok) {
                setStatus('success')
                localStorage.setItem("brandkit_access_token", data.access_token)
                localStorage.setItem("brandkit_refresh_token", data.refresh_token)
                localStorage.setItem("brandkit_client_id", clientId)
                
                sessionStorage.removeItem('code_verifier')
                sessionStorage.removeItem('oauth_client_id')
            } else {
                statusMapping['error'].message = data?.error?.message || 'Token exchange failed'
                setStatus('error')
            }
        } catch (err) {
            statusMapping['error'].message = 'Network error during token exchange'
            setStatus('error')
        }
    }

    return <div style={{fontWeight: 'bold', fontSize: '30px', color: statusMapping[status].color}}>{statusMapping[status].message}</div>
}

export default Callback