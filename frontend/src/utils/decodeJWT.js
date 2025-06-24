export function decodeJWT(token) {
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode JWT", error);
    return null;
  }
}
