import React from "react";
import CategoryCard from "./CategoryCard";
import {
  Monitor,
  MonitorSmartphone,
  ShoppingBag,
  House,
  Shapes,
  LibraryBig,
  Dumbbell,
} from "lucide-react";
import BlurCircle from "./BlurCircle";

const CategoriesSection = () => {
  return (
    <div className="text-center font-medium ">

      <p className="max-md:text-2xl md:text-3xl font-medium ">Browse Categories</p>
      <div className="flex justify-evenly items-center flex-wrap m-5">
        <CategoryCard
          Category="Electronics"
          Icon={<MonitorSmartphone className="w-full md:h-20 max-md:h-13" />}
        />
        <CategoryCard
          Category="Fashion"
          Icon={<ShoppingBag className="w-full md:h-20 max-md:h-13" />}
        />
        <CategoryCard
          Category="Home Appliances "
          Icon={<House className="w-full md:h-20 max-md:h-13" />}
        />
        <CategoryCard
          Category="Toys"
          Icon={<Shapes className="w-full md:h-20 max-md:h-13" />}
        />
        <CategoryCard
          Category="Books"
          Icon={<LibraryBig className="w-full md:h-20 max-md:h-13" />}
        />
        <CategoryCard
          Category="Sports"
          Icon={<Dumbbell className="w-full md:h-20 max-md:h-13" />}
        />
      </div>
    </div>
  );
};

export default CategoriesSection;
