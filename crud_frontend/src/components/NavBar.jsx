export default function NavBar({ user, onOpen, onSearch, onLogout }) {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <nav className="bg-base-100 shadow-md mt-3 mx-3 md:mx-5 px-4 md:px-6 py-3 rounded-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        {/* Left side - Brand */}
        <div className="flex-shrink-0">
          <a className="btn btn-ghost text-2xl font-bold text-primary">Huwaw</a>
        </div>

        {/* Center - Search */}
        <div className="w-full md:flex-grow md:max-w-xl">
          <input
            type="text"
            placeholder="🔍 Search clients..."
            className="input input-bordered w-full rounded-full px-4"
            onChange={handleSearchChange}
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Add button */}
          <button
            className="btn btn-primary px-4 rounded-lg shadow-md hover:shadow-lg transition w-full md:w-auto"
            onClick={onOpen}
          >
            ➕ Add
          </button>
           <button
            className="btn btn-primary px-4 rounded-lg shadow-md hover:shadow-lg transition w-full md:w-auto"
            onClick={onLogout}
          >
            🚪 Logout
          </button>

          {/* User dropdown with photo + name */}
          {/*user && (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
              >
                <div className="avatar">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={user.photo || "https://via.placeholder.com/150"}
                      alt="User Avatar"
                    />
                  </div>
                </div>
                <span className="hidden sm:block font-medium text-gray-700 truncate max-w-[100px] md:max-w-[150px]">
                  {user.name || user.email}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500 hidden sm:block"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </label>

              {/* Dropdown menu *//*}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-white rounded-xl w-40 border"
              >
                <li>
                  <button
                    onClick={onLogout}
                    className="text-red-600 hover:bg-red-50 font-medium"
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>
          )*/}
        </div>
      </div>
    </nav>
  );
}
