export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null; // No token means no user logged in

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    console.log(payload);
    return payload.role || null; // Return role if exists
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getUserData = () => {
  const token = localStorage.getItem("token");
  if (!token) return null; // No token means no user logged in

  try {
    const user = localStorage.getItem("user");
    if (!user) return null; // No user means no user logged in
    return JSON.parse(user);
  } catch (err) {
    console.error("Error parsing user data:", err);
    return null;
  }
};
