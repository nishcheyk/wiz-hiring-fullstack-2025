// Utility to check if user is approved (from localStorage or API)
export async function isUserApproved() {
  const userId = localStorage.getItem('userId');
  if (!userId) return false;
  try {
    // Use a dedicated endpoint to get current user info
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
      headers: { 'Authorization': userId }
    });
    if (!res.ok) return false;
    const user = await res.json();
    return user && user.is_approved === 1;
  } catch {
    return false;
  }
}
