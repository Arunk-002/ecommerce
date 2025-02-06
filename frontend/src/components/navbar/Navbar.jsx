import './navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { FaRegUserCircle, FaCartPlus } from "react-icons/fa";

import Cart from "../cartPage/Cart";
import Footer  from "../footer/Footer";
import OrderPage from "../OrderPage/OrderPage";
export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const [cart, setCart] = useState(false);
  const [order,setOrders] = useState(false)
  const navigate = useNavigate();
  console.log(user);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const cancel = () => {
    setCart(false);
  };
  const handleUser = () => {
    navigate("/user");
  };

  const handleOrders = ()=>{
    setOrders((prev)=>!prev)
  }
  return (
    <>
      <nav className="nav-elem-clr p-5  top-0 sticky bg-[#F5EBDA] z-10">
        <div className="flex px-5 justify-between items-center">
          <div className="justify-start">
            <img
              alt="VinoRoge"
              src="/Logo.png"
              className="h-auto w-[70%] logo-image"
            />
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-1 font-semibold text-lg  ${
                    isActive ? "border-b-2 border-b-[#623D2A]" : ""
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to={"/shop"}
                className={({ isActive }) =>
                  `px-1 font-semibold text-lg  ${
                    isActive ? "border-b-2 border-b-[#623D2A]" : ""
                  }`
                }
              >
                Shop
              </NavLink>
              {user ? (
                <button
                  onClick={() => setCart(!cart)}
                  className={({ isActive }) =>
                    `px-1 font-semibold text-lg  ${
                      isActive ? "border-b-2 border-b-[#623D2A]" : ""
                    }`
                  }
                >
                  <FaCartPlus />
                </button>
              ) : null}
              {user ? (
                <div className="px-1 group  relative font-semibold text-2xl">
                  <FaRegUserCircle />
                  <div className="absolute top-full right-0 bg-white w-36   opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transition-all duration-200 rounded-md">
                    <div className="flex flex-col p-2">
                      <button
                        className="cursor-pointer pr-6 hover:bg-gray-100 text-lg text-right"
                        onClick={() => handleUser()}
                      >
                        <span className="text-[#AF6900]">Hi</span> {user?.name}
                      </button>
                      <button
                        className="cursor-pointer pr-6 hover:bg-gray-100 text-lg text-right"
                        onClick={() => handleOrders()}
                      >
                        <span className="text-[#AF6900]">Orders</span>
                      </button>
                      <button
                        className="cursor-pointer pr-6 hover:bg-gray-100 text-lg text-right"
                        onClick={() => handleLogout()}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  to={"/login"}
                  className={({ isActive }) =>
                    `px-1 font-semibold text-lg ${
                      isActive ? "border-b-2 border-b-[#623D2A]" : ""
                    }`
                  }
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Outlet>

      </Outlet>
      {cart && <Cart cancel={cancel} />}
      {order && <OrderPage cancel ={handleOrders}/>}
      <Footer />
    </>
  );
}
