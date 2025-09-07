import axios from "axios";
import { useState, useEffect } from "react";
export default function TableList({ handleOpen, searchTerm }) {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("id-asc");
  // Fetch clients from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://crud-react-g32u.onrender.com/api/clients"
        );
        setTableData(response.data);
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
  }, []);

  // Filter table data
  let filteredData = tableData.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort logic
  if (sortOption === "id-asc") {
    filteredData = [...filteredData].sort((a, b) => a.id - b.id);
  } else if (sortOption === "id-desc") {
    filteredData = [...filteredData].sort((a, b) => b.id - a.id);
  } else if (sortOption === "name-asc") {
    filteredData = [...filteredData].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortOption === "name-desc") {
    filteredData = [...filteredData].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mt-5">
        {/* Title */}
        <h2 className="text-2xl font-bold ml-10">Client List</h2>

        {/* Sort Controls */}
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
          <thead className="bg-base-200 text-base-content ">
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
            {filteredData.map((client) => (
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
