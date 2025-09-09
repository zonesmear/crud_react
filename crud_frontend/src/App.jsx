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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleOpen = (mode, client = null) => {
    setIsOpen(true);
    setModalMode(mode);
    setClientData(client);
  };

  const handleSubmit = async (newClient) => {
    if (modalMode === "add") {
      await axios.post("https://crud-react-g32u.onrender.com/api/clients", newClient);
    } else if (modalMode === "edit") {
      await axios.put(
        `https://crud-react-g32u.onrender.com/api/clients/${newClient.id}`,
        newClient
      );
    } else if (modalMode === "delete") {
      await axios.delete(
        `https://crud-react-g32u.onrender.com/api/clients/${clientData.id}`
      );
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
