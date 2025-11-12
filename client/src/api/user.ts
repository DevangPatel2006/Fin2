import axios from "axios";

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://finlanza-backend1.onrender.com/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};