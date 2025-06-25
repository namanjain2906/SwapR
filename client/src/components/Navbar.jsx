import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  MapPin,
  MenuIcon,
  Package,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const { products } = useAppContext();
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((product) =>
      product?.title?.toLowerCase().includes(search.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // Limit to top 5 suggestions
  };
  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-5 md:px-16 lg:px-36 backdrop-blur bg-transparent">
      <Link to="/" className="text-xl min-md:text-2xl max:md-flex-1 mx-5">
        SwapR
      </Link>

      <div
        className={`max-md:absolute top-0 left-0 backdrop-blur max-md:font-medium max-md:text-2xl md:py-3 md:px-6 max-md:gap-8 md:gap-3 lg:gap-16 bg-black/70 max-md:h-screen flex flex-col md:flex-row justify-center items-center min-md:rounded-full md:border md:bg-white/10 md:border-gray-300/20 overflow-hidden transition-[width] duration-300
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/products/search/${search}`);
              }}
              className="flex justify-center items-center max-md:gap-3 md:gap-5 lg:gap-8"
            >
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search for products"
                  value={search}
                  onChange={handleSearch}
                  className="w-full bg-white/10 px-4 py-3 border border-gray-300/20 rounded-full backdrop-blur text-white placeholder:text-gray-500 focus:outline-none focus:ring-1  transition-all duration-300"
                />

                {suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full mt-2 bg-gray-800 border-gray-300/20 text-white rounded-lg z-50 shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((item, index) => (
                      <li
                        key={index}
                        className="px-4 py-2  hover:bg-gray-600/30 cursor-pointer"
                        onClick={() => {
                          setSearch(item.title);
                          setSuggestions([]);
                        }}
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <SearchIcon
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  search
                    ? navigate(`/products/search/${search}`)
                    : setIsSearch(false);
                }}
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
                onClick={() => navigate("/my-orders")}
              />
              <UserButton.Action
                label="My Address"
                labelIcon={<MapPin width={15} />}
                onClick={() => navigate("/address")}
              />
              <UserButton.Action
                label="Admin Panel"
                labelIcon={<CircleUserRound width={15} />}
                onClick={() => navigate("/admin")}
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
