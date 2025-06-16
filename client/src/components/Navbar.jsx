import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, Package, SearchIcon, UserRound, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-5 md:px-16 lg:px-36 backdrop-blur bg-transparent">
      
      <Link to="/" className="text-xl min-md:text-2xl max:md-flex-1 mx-5">
        SwapR
      </Link>

      <div
        className={`max-md:absolute top-0 left-0 backdrop-blur max-md:font-medium md:py-3 md:px-6 md:gap-3 lg:gap-16 bg-black/70 max-md:h-screen flex flex-col md:flex-row justify-center items-center min-md:rounded-full md:border md:bg-white/10 md:border-gray-300/20 overflow-hidden transition-[width] duration-300
        ${isOpen ? "max-md:w-full" : "max-md:w-0"}`}
      >
        <XIcon
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer hover:text-gray-300"
        ></XIcon>
        <Link
          to={"/"}
          onClick={() => {
            setIsOpen(false);
            scrollTo(0, 0);
          }}
          className="hover:text-gray-300"
        >
          Home
        </Link>
        <Link
          to={"/products"}
          onClick={() => {
            setIsOpen(false);
            scrollTo(0, 0);
          }}
          className="hover:text-gray-300"
        >
          Products
        </Link>
        <Link
          to={"/cart"}
          onClick={() => {
            setIsOpen(false);
            scrollTo(0, 0);
          }}
          className="hover:text-gray-300"
        >
          Cart
        </Link>
      </div>

      <div className="flex items-center max-md:gap-3 md:gap-5 lg:gap-8">
        <div className="flex gap-2 md:4 lg:5 justify-center mx-2 md:5 items-center">
          {isSearch ? (
            <form onSubmit={(e)=> {e.preventDefault(); alert(search);}} className="flex justify-center items-center max-md:gap-3 md:gap-5 lg:gap-8">
              <input
                type="text"
                placeholder="Search for products"
                value={search}
                onChange={(event)=>setSearch(event.target.value)}
                className={`bg-white/10 px-2 py-3 md:px-4 md:py-3 max-lg:w-50 lg:w-70 border max-md:w-20 border-gray-300/20 overflow-hidden transition-[width] duration-300 rounded-full backdrop-blur 
                }`}
              />

              <SearchIcon
                type="submit"
                onClick={(e)=> {e.preventDefault(); search?alert(search):setIsSearch(false)} }
                className="cursor-pointer hover:text-gray-300 w-8 h-8"
              ></SearchIcon>
            </form>
          ) : (
            <SearchIcon
              onClick={() => setIsSearch(true)}
              className="cursor-pointer hover:text-gray-300 w-8 h-8"
            ></SearchIcon>
          )}
        </div>

        {!user ? (
          <button
            onClick={() => openSignIn()}
            className="bg-[#F84565] py-2 px-6 font-medium rounded-full cursor-pointer hover:bg-[#D63854]"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Orders"
                labelIcon={<Package width={15} />}
                onClick={() => navigate("my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      <MenuIcon
        onClick={() => setIsOpen(true)}
        className="w-8 h-8 cursor-pointer hover:text-gray-300 min-md:hidden"
      />
    </div>
  );
};

export default Navbar;
