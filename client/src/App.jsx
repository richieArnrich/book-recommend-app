import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login";
import AddBook from "./pages/AddBook";
import UpdateBook from "./pages/UpdateBook";
import { ToastContainer } from "react-toastify";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addbook" element={<AddBook />} />
          <Route path="/updatebook/:id" element={<UpdateBook />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
