import axios from "axios";

const Instance = axios.create({
  baseURL: "https://book-recommend-app-pcxi.onrender.com", // Set the base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default Instance;
