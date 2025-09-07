import { useState } from "react";
import "./App.css";
import ModalForm from "./components/Modalform";
import NavBar from "./components/NavBar";
import TableList from "./components/TableList";
import axios from "axios";
import cors from 'cors';
app.use(cors());

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [clientData, setClientData] = useState(null);
const [clients, setClients] = useState([]);

const fetchClients = async () => {
  try {
    const response = await axios.get("https://crud-react-g32u.onrender.com/api/clients");
    setClients(response.data.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => { fetchClients(); }, []);

  // Accept both mode and client from TableList
  const handleOpen = (mode, client = null) => {
    setIsOpen(true);
    setModalMode(mode);
    setClientData(client); // store client for edit/delete
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
      console.log("modal mode is add");
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
      console.log("modal mode is edit");
    } else if (modalMode === "delete") {
      try {
        const response = await axios.delete(
          `https://crud-react-g32u.onrender.com/api/clients/${clientData.id}`
        );
        console.log("Client deleted:", response.data);
      } catch (error) {
        console.error("Error Deleting Client:", error);
      }
      console.log("modal mode is delete");
    }
  };

  return (
    <>
      <ModalForm
        isOpen={isOpen}
        onSubmit={handleSubmit}
        onClose={() => setIsOpen(false)}
        mode={modalMode}
        clientData={clientData}
      />
      <NavBar onOpen={() => handleOpen("add")} onSearch={setSearchTerm} />
      <TableList handleOpen={handleOpen} searchTerm={searchTerm} />
    </>
  );
}

export default App;
