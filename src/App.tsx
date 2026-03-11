import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Integration from './Integration'
import Callback from './Callback'

const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <Integration />
  },
  {
    path: 'integration',
    element: <Integration />,
  },
  {
    path: '/callback',
    element: <Callback />
  }
])

function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App

/**
 * code - 7104d990-f04d-4be2-97ea-40d72d5d2a41
 * pk_2d188359e1caa032732ee89b8fb66a9ea39dc61398614d6994e563bb55dadddc
 * &brand_kit_id=157273de-8eaa-47df-9d20-655ecff19e8d
 * &access_token=eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjU0MzIxL2F1dGgvdjEiLCJzdWIiOiIxNDdmYmMwMi02Nzc0LTRlZDAtYWRmMi1mMTA5ZmJkMDU2MGMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzcxOTIwNzU1LCJpYXQiOjE3NzE5MTcxNTUsImVtYWlsIjoidGVzdC51c2VyQHlvcG1haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InRlc3QudXNlckB5b3BtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJUZXN0IFVzZXIiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjE0N2ZiYzAyLTY3NzQtNGVkMC1hZGYyLWYxMDlmYmQwNTYwYyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzcxOTE3MTU1fV0sInNlc3Npb25faWQiOiIxMTM5Y2M1Mi00Zjc0LTQ3OGUtOGE1My1mZGNhMmQ2ZmE0OTAiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.1BIiMOm40oMcIfvmhcCWi1jigENauE3yhyeH_ZUg-UdvXEIgIEWj52pCpLf4Lk3E2lwwzk_rEeWD-760sX5ggQ
 */