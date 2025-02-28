export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null; // No token means no user logged in

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return payload.role || null; // Return role if exists
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
