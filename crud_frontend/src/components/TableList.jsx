import axios from "axios";
import { useState, useEffect } from "react";

export default function TableList({ handleOpen, searchTerm }) {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("id-asc");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  // Fetch clients from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/clients`);
        setTableData(response.data); // assuming API returns an array
      } catch (err) {
        setError("Error fetching data");
        if (err.response) {
          console.error("Server responded with status:", err.response.status);
          console.error("Response data:", err.response.data);
        } else if (err.request) {
          console.error("No response received:", err.request);
        } else {
          console.error("Request setup error:", err.message);
        }
      }
    };
    fetchData();
  }, [API_URL]);

  // Filter table data
  const filteredData = tableData.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort logic
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortOption) {
      case "id-asc":
        return a.id - b.id;
      case "id-desc":
        return b.id - a.id;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="flex justify-between items-center mt-5">
        <h2 className="text-2xl font-bold ml-10">Client List</h2>
        <div className="flex items-center mr-10">
          <select
            className="select select-bordered"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="id-desc">Descend</option>
            <option value="id-asc">Ascend</option>
            <option value="name-asc">A → Z</option>
            <option value="name-desc">Z → A</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-5 ml-5 mr-5">
        {error && <p className="text-red-500">{error}</p>}
        <table className="table table-zebra">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Age</th>
              <th className="px-6 py-3">Job</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="hover">
            {sortedData.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4">{client.id}</td>
                <td className="px-6 py-4">{client.name}</td>
                <td className="px-6 py-4">{client.age}</td>
                <td className="px-6 py-4">{client.job}</td>
                <td className="px-6 py-4">{client.email}</td>
                <td className="px-6 py-4">
                  <button
                    className={`btn rounded-full w-20 ${
                      client.isactive ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    {client.isactive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="btn btn-secondary mr-3"
                    onClick={() => handleOpen("edit", client)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={() => handleOpen("delete", client)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
