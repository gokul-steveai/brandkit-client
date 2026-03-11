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

        if (code) {
            exchangeCodeForToken(code)
        } else {
            setStatus('error')
            statusMapping['error'].message = 'No authorization code found'
        }

    }, [])

    async function exchangeCodeForToken(code: string) {
        const tokenUrl = import.meta.env.VITE_TOKEN_URL || "https://hizoxwyykgxtmfvqzwyc.supabase.co/functions/v1/oauth-token"
        
        try {
            const res = await fetch(tokenUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: code,
                    client_id: import.meta.env.VITE_CLIENT_ID,
                    grant_type: 'authorization_code',
                    code_verifier: sessionStorage.getItem('code_verifier')
                })
            })

            const data = await res.json()
            if (res.ok) {
                console.log("Access Token:", data.access_token)
                setStatus('success')
                localStorage.setItem("brandkit_access_token", data.access_token)
                localStorage.setItem("brandkit_refresh_token", data.refresh_token)
                
                // Clear the code verifier after successful exchange
                sessionStorage.removeItem('code_verifier')
            } else {
                console.error('Token exchange failed:', data)
                statusMapping['error'].message = data?.error?.message || 'Token exchange failed'
                setStatus('error')
            }
        } catch (err) {
            console.error('Token exchange error:', err)
            statusMapping['error'].message = 'Network error during token exchange'
            setStatus('error')
        }
    }

    return <div style={{fontWeight: 'bold', fontSize: '30px', color: statusMapping[status].color}}>{statusMapping[status].message}</div>
}

export default Callback