// Utility to check if user is approved (from localStorage or API)
export async function isUserApproved() {
  const userId = localStorage.getItem('userId');
  if (!userId) return false;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users?adminEmail=admin@gmail.com`);
    const users = await res.json();
    const user = users.find(u => u.email === userId);
    return user && user.is_approved === 1;
  } catch {
    return false;
  }
}
