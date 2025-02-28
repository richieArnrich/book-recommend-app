import axios from "axios";

const Instance = axios.create({
  baseURL: "http://localhost", // Set the base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default Instance;
