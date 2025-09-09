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
  const [user, setUser] = useState(null); // 🔑 Auth state

  // Load user from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ Clear storage
  };

  const handleOpen = (mode, client = null) => {
    setIsOpen(true);
    setModalMode(mode);
    setClientData(client);
  };

  const handleSubmit = async (newClient) => {
    if (modalMode === "add") {
      try {
        const response = await axios.post(
          "https://crud-react-g32u.onrender.com/api/clients",
          newClient
        );
        console.log("Client added:", response.data);
      } catch (error) {
        console.error("Error Adding Client:", error);
      }
    } else if (modalMode === "edit") {
      try {
        const response = await axios.put(
          `https://crud-react-g32u.onrender.com/api/clients/${newClient.id}`,
          newClient
        );
        console.log("Client updated:", response.data);
      } catch (error) {
        console.error("Error Updating Client:", error);
      }
    } else if (modalMode === "delete") {
      try {
        const response = await axios.delete(
          `https://crud-react-g32u.onrender.com/api/clients/${clientData.id}`
        );
        console.log("Client deleted:", response.data);
      } catch (error) {
        console.error("Error Deleting Client:", error);
      }
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
