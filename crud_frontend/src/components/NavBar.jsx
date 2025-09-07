export default function NavBar({ onOpen, onSearch }) {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <nav className="bg-base-100 shadow-sm mt-5 mx-5 px-4 py-3 rounded-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left side - Brand */}
        <div className="flex-shrink-0">
          <a className="btn btn-ghost text-xl">Huwaw</a>
        </div>

        {/* Center - Search */}
        <div className="flex justify-center flex-grow w-full md:w-1/2">
          <div className="form-control w-full">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-full"
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Right side - Add button */}
        <div className="flex-shrink-0">
          <button className="btn btn-primary w-full md:w-auto" onClick={onOpen}>
            Add Client
          </button>
        </div>
      </div>
    </nav>
  );
}
