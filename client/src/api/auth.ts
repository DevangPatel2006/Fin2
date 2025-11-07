import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // change to your backend URL if deployed
});

export const signup = (formData: {
  name: string;
  email: string;
  password: string;
}) => API.post("/signup", formData);

export const login = (formData: {
  email: string;
  password: string;
}) => API.post("/login", formData);
