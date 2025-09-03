import React from 'react'
import { useNavigate } from 'react-router-dom'


const CategoryCard = ({Category, Icon}) => {
    const navigate = useNavigate()
  return (

    <div className='group hover:-translate-y-0.5 flex justify-center items-center max-md:gap-3 md:gap-5 flex-col md:h-60 w-50 max-md:h-45 bg-gray-800 rounded-2xl m-5 max-md:text-lg text-xl'>
        {Icon}
        <p>{Category}</p>
        <button onClick={()=>navigate(`/products/categories/${Category}`)} className='bg-[#F84565] py-1 px-5 text-sm rounded-full cursor-pointer hover:bg-[#D63854]'>Explore</button>
    </div>
  )
}

export default CategoryCard