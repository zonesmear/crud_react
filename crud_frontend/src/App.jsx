import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import ModalForm from "./components/ModalForm";
import NavBar from "./components/NavBar";
import TableList from "./components/TableList";
import Login from "./components/Login";
import axios from "axios";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [clientData, setClientData] = useState(null);

  // 🔑 Auth state
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null; // ✅ initialize from localStorage
  });

  // ✅ Attach token to every request
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // ✅ clear token
  };

  const handleOpen = (mode, client = null) => {
    setIsOpen(true);
    setModalMode(mode);
    setClientData(client);
  };

  const handleSubmit = async (newClient) => {
  try {
    if (modalMode === "add") {
      const response = await axios.post(
        "https://crud-react-g32u.onrender.com/api/clients",
        newClient
      );
      /*setTableData((prevData) => [...prevData, response.data.data]);*/
    } 
    else if (modalMode === "edit") {
      const response = await axios.put(
        `https://crud-react-g32u.onrender.com/api/clients/${newClient.id}`,
        newClient
      );
      /*setTableData((prevData) =>
        prevData.map((client) =>
          client.id === newClient.id ? response.data.data : client
        )
      );*/
    } 
    else if (modalMode === "delete") {
      await axios.delete(
        `https://crud-react-g32u.onrender.com/api/clients/${clientData.id}`
      );
     /* setTableData((prevData) =>
        prevData.filter((client) => client.id !== clientData.id)
      );*/
    }

    setIsOpen(false); // ✅ close modal after success
  } catch (err) {
    console.error("Error handling submit:", err);
    alert("❌ Something went wrong. Please try again.");
  }
};


  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login onLogin={setUser} />} />

        {/* Protected route */}
        <Route
          path="/"
          element={
            user ? (
              <>
                <NavBar
                  onOpen={() => handleOpen("add")}
                  onSearch={setSearchTerm}
                  onLogout={handleLogout}
                />
                <TableList handleOpen={handleOpen} searchTerm={searchTerm} />
                <ModalForm
                  isOpen={isOpen}
                  onSubmit={handleSubmit}
                  onClose={() => setIsOpen(false)}
                  mode={modalMode}
                  clientData={clientData}
                />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
