import axios from "axios";

const Instance = axios.create({
  baseURL: "https://book-recommend-app-api.vercel.app/", // Set the base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default Instance;
