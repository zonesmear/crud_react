import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
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

  // Accept both mode and client from TableList
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

        {/* Protected route: only show dashboard if logged in */}
        <Route
          path="/"
          element={
            user ? (
              <>
                <NavBar onOpen={() => handleOpen("add")} onSearch={setSearchTerm} />
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
