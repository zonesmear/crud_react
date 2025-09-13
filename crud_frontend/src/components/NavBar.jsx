export default function NavBar({ user, onOpen, onSearch, onLogout }) {
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Add button */}
          <button className="btn btn-primary w-full md:w-auto" onClick={onOpen}>
            Add Client
          </button>

          {/* User dropdown with photo + name */}
          {user && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="flex items-center gap-2 cursor-pointer">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={user.photo || "https://via.placeholder.com/150"}
                      alt="User Avatar"
                    />
                  </div>
                </div>
                <span className="font-medium">{user.name || user.email}</span>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40"
              >
                <li>
                  <button onClick={onLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
