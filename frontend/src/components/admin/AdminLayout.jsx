import { Link, Outlet, useNavigate } from "react-router-dom";
import { MdOutlineWavingHand } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
export default function AdminLayout() {
  const navigate = useNavigate()
  const { logout } = useContext(UserContext);

  const handleLogout = () => {
    logout(); // Logs out the user or admin
    navigate('/login')
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-white flex flex-col p-5 shadow-lg">
        <div className="flex items-center gap-2 text-2xl font-bold text-[#482817] border-b-2 pb-4 border-[#9E845C]">
          <MdOutlineWavingHand />
          <p>Admin</p>
        </div>
        <div className="flex flex-col mt-4 space-y-3">
          <Link
            to="/admin/products"
            className="p-2 text-sm bg-slate-300 rounded-md text-black font-bold hover:bg-slate-600 hover:text-white"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="p-2 text-sm bg-slate-300 rounded-md text-black font-bold hover:bg-slate-600 hover:text-white"
          >
            Manage Orders
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Right Side Content */}
      <div className="flex-1 bg-[#F5EBDA] p-5 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
