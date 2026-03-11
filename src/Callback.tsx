import { useEffect, useState } from "react"

const statusMapping = {
    'in-progress': { message: 'Connecting BrandKit...', color: 'gray' },
    'success': { message: 'Authenticated Successfully', color: 'green' },
    'error': { message: 'Authentication Failed', color: 'red' }
}

function Callback() {
    const [status, setStatus] = useState<keyof typeof statusMapping>('in-progress')

    useEffect(() => {

        const params = new URLSearchParams(window.location.search)

        const code = params.get("code")

        if (code) {
            exchangeCodeForToken(code)
        }

    }, [])

    async function exchangeCodeForToken(code: string) {

        const res = await fetch(
            "http://localhost:54321/functions/v1/oauth-token",
            {
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
            }
        )

        const data = await res.json()
        if (res.ok) {
            console.log("Access Token:", data.access_token)

            setStatus('success')

            localStorage.setItem("brandkit_access_token", data.access_token)
        } else {
            statusMapping['error'].message = data?.error?.message
            setStatus('error')
        }
    }

    return <div style={{fontWeight: 'bold', fontSize: '30px', color: statusMapping[status].color}}>{statusMapping[status].message}</div>
}

export default Callback