// src/api/brandkit.ts
const API_URL = import.meta.env.VITE_BRANDKIT_API_URL;
const API_KEY = import.meta.env.VITE_BRANDKIT_API_KEY;

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

// Link your integration (one-time setup)
export async function linkIntegration(data: {
  brandKitId: string;
  externalUserId: string;
  externalWorkspaceId?: string;
  webhookUrl?: string;
}) {
  const res = await fetch(`${API_URL}/v1/integrations/partner/link`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

// Get single brand kit
export async function getBrandKit(brandKitId: string) {
  const res = await fetch(`${API_URL}/v1/brand-kits/${brandKitId}`, { headers });
  return res.json();
}

// List brand kits by external user
export async function listBrandKits(externalUserId: string) {
  const res = await fetch(
    `${API_URL}/v1/brand-kits?external_user_id=${externalUserId}`,
    { headers }
  );
  return res.json();
}
