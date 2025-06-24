import {
  LayoutDashboardIcon,
  ListIcon,
  MessageCircleMoreIcon,
  PlusSquareIcon,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const AdminSidebar = () => {
  const { user } = useAppContext();
  const adminNavLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Products", path: "/admin/add-products", icon: PlusSquareIcon },
    { name: "Order Request", path: "/admin/order-request", icon: MessageCircleMoreIcon },
    { name: "List Products", path: "/admin/list-products", icon: ListIcon },
  ];

  return (
    <div className="h-[calc(10@vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      <img className="rounded-full h-15 w-15" src={user.imageUrl} alt="" />
      <p className="mt-2 text-base max-md:hidden">
        {user.firstName} {user.lastName}
      </p>
      <div className="w-full">
        {adminNavLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${
                isActive && "bg-[#F84565]/15 text-[#F84565] group"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />
                <p className="max-md:hidden"> {link.name}</p>
                <span
                  className={`w-1.5 h-10 rounded-1 right-0 absolute ${
                    isActive && "bg-[#F84565]"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
export default AdminSidebar;
