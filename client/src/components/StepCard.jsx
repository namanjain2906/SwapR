import React from 'react'

const StepCard = ({Icon, Step, Desciption}) => {
  return (
    <div className='flex flex-col flex-wrap w-60 text-center md:m-15 max-md:m-5 justify-evenly items-center'>
        {Icon}
        <p className='font-medium text-lg m-3'>{Step}</p>
        <p className='text-gray-400'>{Desciption}</p>
    </div>
  )
}

export default StepCard