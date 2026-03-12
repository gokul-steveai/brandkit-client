import { useState } from 'react'

function generateCodeVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function Integration() {
  const [externalUserId, setExternalUserId] = useState('')
  const [externalWorkspaceId, setExternalWorkspaceId] = useState('')
  const [clientId, setClientId] = useState(import.meta.env.VITE_CLIENT_ID || '')
  const [authUrl, setAuthUrl] = useState('http://localhost:8080/oauth/authorize')
  const [redirectUri, setRedirectUri] = useState('http://localhost:5173/callback')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleConnect = async () => {
    if(!externalUserId?.trim() && !externalWorkspaceId?.trim()) {
      alert('Please provide either External User ID or External Workspace ID')
      return
    }
    
    if(!clientId?.trim()) {
      alert('Please provide a Client ID')
      return
    }
    
    setIsLoading(true)
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    
    // Store both code_verifier and client_id in sessionStorage for callback
    sessionStorage.setItem('code_verifier', codeVerifier)
    sessionStorage.setItem('oauth_client_id', clientId)

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    })
    
    if(externalUserId?.trim()) params.append('external_user_id', externalUserId)
    if(externalWorkspaceId?.trim()) params.append('external_workspace_id', externalWorkspaceId)

    window.location.href = `${authUrl}?${params.toString()}`
  }
  
  return (
    <div style={{ width: '450px', margin: 'auto', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '10px', backgroundColor: '#fff' }}>
      <h2 style={{ marginBottom: '10px', color: '#333' }}>OAuth Integration</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleConnect(); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '24px',}}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#555' }}>External User ID</label>
          <input
            type="text"
            placeholder="Enter user ID"
            value={externalUserId}
            onChange={(e) => setExternalUserId(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #e0e0e0', fontSize: '14px', transition: 'border 0.3s', outline: 'none', backgroundColor: '#f9f9f9', color: '#333' }}
            onFocus={(e) => e.target.style.borderColor = '#000'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#555' }}>External Workspace ID</label>
          <input
            type="text"
            placeholder="Enter workspace ID"
            value={externalWorkspaceId}
            onChange={(e) => setExternalWorkspaceId(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #e0e0e0', fontSize: '14px', transition: 'border 0.3s', outline: 'none', backgroundColor: '#f9f9f9', color: '#333' }}
            onFocus={(e) => e.target.style.borderColor = '#000'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>
        <p style={{ fontSize: '12px', color: '#666', margin: '-5px 0 0 0' }}>* At least one external ID is required</p>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#555' }}>Client ID</label>
          <input
            type="text"
            placeholder="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #e0e0e0', fontSize: '14px', transition: 'border 0.3s', outline: 'none', backgroundColor: '#f9f9f9', color: '#333' }}
            onFocus={(e) => e.target.style.borderColor = '#000'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#555' }}>Authorization URL</label>
          <input
            type="url"
            placeholder="https://example.com/oauth/authorize"
            value={authUrl}
            onChange={(e) => setAuthUrl(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #e0e0e0', fontSize: '14px', transition: 'border 0.3s', outline: 'none', backgroundColor: '#f9f9f9', color: '#333' }}
            onFocus={(e) => e.target.style.borderColor = '#000'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#555' }}>Redirect URI</label>
          <input
            type="url"
            placeholder="https://yourapp.com/callback"
            value={redirectUri}
            onChange={(e) => setRedirectUri(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #e0e0e0', fontSize: '14px', transition: 'border 0.3s', outline: 'none', backgroundColor: '#f9f9f9', color: '#333' }}
            onFocus={(e) => e.target.style.borderColor = '#000'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>
        <div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '50%',
            backgroundColor: isLoading ? '#666' : '#000', 
            borderRadius: '6px', 
            padding: '10px', 
            color: 'white', 
            border: '2px solid transparent', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '10px',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#333')}
          onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#000')}
        >
          {isLoading ? 'Connecting...' : 'Connect Brand Kit OS'}
        </button></div>
      </form>
    </div>
  )
}

export default Integration