import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login";
import AddBook from "./pages/AddBook";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addbook" element={<AddBook />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
