const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    },
  });

  // Si el token expiró o es inválido, cerramos sesión
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return response;
}