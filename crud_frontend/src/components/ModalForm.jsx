import { useState, useEffect  } from "react";
export default function ModalForm({ isOpen, onClose, onSubmit, mode, clientData }) {
   // Don’t render modal when closed

   const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(false);

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
      setStatus(clientData.isactive || false);
    } else if (mode === "add") {
      // reset fields when adding a new client
      setName("");
      setJob("");
      setAge("");
      setEmail("");
      setStatus(false);
    }
  }, [mode, clientData]);



  const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission

  try {
    if (mode === "add") {
      const clientPayload = { name, job, age, email, isactive: status };
      await onSubmit(clientPayload);
      console.log("Client added:", clientPayload);

    } else if (mode === "edit") {
      const updatedClientData = { 
        id: clientData.id, 
        name, 
        job, 
        age, 
        email, 
        isactive: status 
      };
      await onSubmit(updatedClientData);
      console.log("Client updated:", updatedClientData);

    } else if (mode === "delete") {
      await onSubmit(clientData.id); // pass only the id
      console.log("Client deleted:", clientData.id);
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
          
          <form method = "dialog" onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center items-center mb-4">
              <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                Name
                <input type="text" placeholder="Type here" className="grow" value={name} onChange={(e) => setName(e.target.value)}/>
              </label>
              <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                Job
                <input type="text" placeholder="Type here" className="grow" value = {job} onChange={(e) => setJob(e.target.value)}/>
              </label>
              <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                Age
                <input type="number" placeholder="Type here" className="grow" value = {age} onChange={(e) => setAge(e.target.value)}/>
              </label>
              <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                Email
                <input type="email" placeholder="Type here" className="grow" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </label>

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
         
            <form method = "dialog" onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center items-center mb-4">
              <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                Name
                <input type="text" placeholder="Type here" className="grow" value={name} onChange={(e) => setName(e.target.value)}/>
              </label>
              <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                Job
                <input type="text" placeholder="Type here" className="grow" value = {job} onChange={(e) => setJob(e.target.value)}/>
              </label>
              <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                Age
                <input type="number" placeholder="Type here" className="grow" value = {age} onChange={(e) => setAge(e.target.value)}/>
              </label>
              <label className="input input-bordered flex items-center mt-2 gap-2 w-80">
                Email
                <input type="email" placeholder="Type here" className="grow" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </label>

              <select
                defaultValue="Pick a color"
                value={status ? "Active" : "Inactive"}
                onChange={handleStatusChange}
                className="select select-bordered w-80 mt-2"
              >
                Status
                <option className="grow">Inactive</option>
                <option className="grow">Active</option>
              </select>
              <button className="btn btn-secondary mt-10" onClick={onSubmit}>
                Save Changes
              </button>
            </div>
            </form>
          
        ) : (
        
            <form method = "dialog" onSubmit={handleSubmit}>
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
