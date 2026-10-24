const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Ensure cookies (JWT) are sent with every cross-origin request
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Very important for HTTP-only cookies
  };

  // If uploading a file, don't set Content-Type to application/json
  // Let the browser set it to multipart/form-data with the correct boundary
  if (options.body instanceof FormData) {
    delete (fetchOptions.headers as Record<string, string>)['Content-Type'];
  }

  const response = await fetch(url, fetchOptions);
  
  // Try to parse JSON safely
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || `API request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  auth: {
    register: (data: any) => fetchAPI('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => fetchAPI('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => fetchAPI('/api/v1/auth/logout', { method: 'POST' }),
    me: () => fetchAPI('/api/v1/auth/me'),
  },
  medications: {
    getDashboard: () => fetchAPI('/api/v1/medications/dashboard'),
    getHistory: () => fetchAPI('/api/v1/medications/history'),
    getAll: () => fetchAPI('/api/v1/medications'),
    create: (data: any) => fetchAPI('/api/v1/medications', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchAPI(`/api/v1/medications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deactivate: (id: string) => fetchAPI(`/api/v1/medications/${id}`, { method: 'DELETE' }),
    updateDoseStatus: (id: string, status: string) => fetchAPI(`/api/v1/medications/doses/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  prescriptions: {
    scan: (formData: FormData) => fetchAPI('/api/v1/prescriptions/scan', { method: 'POST', body: formData }),
    verify: (id: string, verifiedMedications: any[]) => fetchAPI(`/api/v1/prescriptions/${id}/verify`, { method: 'POST', body: JSON.stringify({ verifiedMedications }) }),
  },
  caregiver: {
    generateInvite: () => fetchAPI('/api/v1/caregiver/invite', { method: 'POST' }),
    acceptInvite: (inviteCode: string) => fetchAPI('/api/v1/caregiver/accept', { method: 'POST', body: JSON.stringify({ inviteCode }) }),
    getPatients: () => fetchAPI('/api/v1/caregiver/patients'),
    getPatientDashboard: (patientId: string) => fetchAPI(`/api/v1/caregiver/patients/${patientId}/dashboard`),
  },
};
