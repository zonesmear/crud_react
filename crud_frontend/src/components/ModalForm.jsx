import { useState, useEffect } from "react";
export default function ModalForm({
  isOpen,
  onClose,
  onSubmit,
  mode,
  clientData,
}) {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_level, setUserLevel] = useState("");
  const [status, setStatus] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleStatusChange = (e) => {
    setStatus(e.target.value === "Active");
  };

  // ✅ Prefill form when editing
  useEffect(() => {
    if (mode === "edit" && clientData) {
      setName(clientData.name || "");
      setJob(clientData.job || "");
      setAge(clientData.age || "");
      setEmail(clientData.email || "");
      setPassword("");
      setUserLevel(clientData.user_level || "");
      setStatus(clientData.isactive || false);
       setPhoto(null);
    } else if (mode === "add") {
      // reset fields when adding a new client
      setName("");
      setJob("");
      setAge("");
      setEmail("");
      setPassword("");
      setUserLevel("");
      setStatus(false);
      setPhoto(null);
    }
  }, [mode, clientData]);

    const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let uploadedPhotoUrl = clientData?.photo || null;

      // 🔼 Upload photo if selected
      if (photo) {
        const formData = new FormData();
        formData.append("file", photo);

        const uploadRes = await axios.post(
          "https://crud-react-g32u.onrender.com/api/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            },
          }
        );

        uploadedPhotoUrl = uploadRes.data.url; // backend should return URL
      }

      if (mode === "add") {
        const clientPayload = {
          name,
          job,
          age,
          email,
          password,
          user_level,
          isactive: status,
          photo: uploadedPhotoUrl,
        };
        await onSubmit(clientPayload);
      } else if (mode === "edit") {
        const updatedClientData = {
          id: clientData.id,
          name,
          job,
          age,
          email,
          password,
          user_level,
          isactive: status,
          photo: uploadedPhotoUrl,
        };
        await onSubmit(updatedClientData);
      } else if (mode === "delete") {
        await onSubmit(clientData.id);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }

    onClose();
  };

  if (!isOpen) return null; // don’t render if closed

  return (
    <>
      <dialog id="my_modal_3" className="modal" open={isOpen}>
        <div className="modal-box relative">
          {/* Close button */}
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Title */}
          <h3 className="font-bold text-lg mb-4">
            {mode === "add"
              ? "Add Client"
              : mode === "edit"
              ? "Edit Client"
              : "Delete Client"}
          </h3>
          {mode === "add" ? (
            <form method="dialog" onSubmit={handleSubmit}>
              <div className="flex flex-col justify-center items-center mb-4">
                   {/* File Upload */}
              <div className="w-80 mt-4">
                <label className="block font-medium mb-2">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />

                {/* Progress bar */}
                {uploadProgress > 0 && (
                  <progress
                    className="progress progress-primary w-full mt-2"
                    value={uploadProgress}
                    max="100"
                  >
                    {uploadProgress}%
                  </progress>
                )}
              </div>
              
                <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                  Name
                  <input
                    type="text"
                    placeholder="Type here"
                    className="grow"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                  Job
                  <input
                    type="text"
                    placeholder="Type here"
                    className="grow"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                  Age
                  <input
                    type="number"
                    placeholder="Type here"
                    className="grow"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                  Email
                  <input
                    type="email"
                    placeholder="Type here"
                    className="grow"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                  Password
                  <input
                    type="password"
                    placeholder="Type here"
                    className="grow"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <select
                  value={user_level}
                  onChange={(e) => setUserLevel(e.target.value)}
                  className="select select-bordered w-80 mt-2"
                >
                  <option>Manager</option>
                  <option>Staff</option>
                </select>

                <select
                  value={status ? "Active" : "Inactive"}
                  onChange={handleStatusChange}
                  className="select select-bordered w-80 mt-2"
                >
                  <option>Inactive</option>
                  <option>Active</option>
                </select>

                <button type="submit" className="btn btn-primary mt-10">
                  {mode === "add" ? "Add Client" : "Save Changes"}
                </button>
              </div>
            </form>
          ) : mode === "edit" ? (
            <form method="dialog" onSubmit={handleSubmit}>
              <div className="flex flex-col justify-center items-center mb-4">
                <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                  Name
                  <input
                    type="text"
                    placeholder="Type here"
                    className="grow"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                  Job
                  <input
                    type="text"
                    placeholder="Type here"
                    className="grow"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                  Age
                  <input
                    type="number"
                    placeholder="Type here"
                    className="grow"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                  Email
                  <input
                    type="email"
                    placeholder="Type here"
                    className="grow"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                  Password
                  <input
                    type="password"
                    placeholder="Type here"
                    className="grow"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <select
                  value={user_level}
                  onChange={(e) => setUserLevel(e.target.value)}
                  className="select select-bordered w-80 mt-2"
                >
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
                <select
                  value={status ? "Active" : "Inactive"}
                  onChange={handleStatusChange}
                  className="select select-bordered w-80 mt-2"
                >
                  <option>Inactive</option>
                  <option>Active</option>
                </select>{" "}
                <button type="submit" className="btn btn-secondary mt-10">
                  {mode === "edit" ? "Save Changes" : "Add Client"}
                </button>
              </div>
            </form>
          ) : (
            <form method="dialog" onSubmit={handleSubmit}>
              <div className="flex flex-col justify-center items-center mb-4">
                <p className="text-red-500">
                  Are you sure you want to delete this client?
                </p>
                <button className="btn btn-error mt-10" onClick={onSubmit}>
                  Delete Client
                </button>
              </div>
            </form>
          )}

          {/* Submit button  <button
          type="button"
          onClick={
            mode === "add"
              ? () => {
                  onSubmit;
                }
              : mode === "edit"
              ? () => console.log("Saving changes...")
              : () => console.log("Deleting Client...")
          }
          className={`${
            mode === "add"
              ? "btn btn-primary mt-4"
              : mode === "edit"
              ? "btn btn-secondary mt-4"
              : "btn btn-error mt-4"
          }`}
        >
          {mode === "add"
            ? "Add Client"
            : mode === "edit"
            ? "Save Changes"
            : "Delete Client"}
        </button>*/}
        </div>
      </dialog>
    </>
  );
}
