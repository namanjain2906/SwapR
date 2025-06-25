import React from 'react'
import StepCard from './StepCard'
import { Camera, CircleDollarSign, MessageCircleMore } from 'lucide-react'
import BlurCircle from './BlurCircle'

const FlowchartSection = () => {
  return (
    <div className='flex justify-center flex-col items-center'>
        <p className='text-center text-4xl mt-30 font-medium'>How SwapR Market Works</p>
        <div className='flex max-md:flex-col justify-evenly m-10'>
            <StepCard Icon={<Camera className='w-full h-18'/>} Step="1. List Your Item" Desciption="Take photos, write a description, and set your price. Listing is free and takes just minutes." />
            <StepCard Icon={<MessageCircleMore className='w-full h-18'/>} Step="2. Connect with Buyers" Desciption="Respond to interested buyers, answer questions, and arrange a safe meetup." />
            <StepCard Icon={<CircleDollarSign className='w-full h-18'/>} Step="3. Get Paid" Desciption="Meet safely, exchange the item, and receive your payment. It's that simple!" />
        </div>
    </div>
  )
}

export default FlowchartSection