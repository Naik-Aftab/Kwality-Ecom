import React from 'react'
import Button from '@mui/material/Button';

export const Cta = () => {
  return (
    <div className='container flex justify-center items-center text-center rounded-2xl my-5' style={{backgroundImage:'url(doodle-bg.png)', backgroundColor: '#ffe9e9f0', height:'300px',
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        overflow: 'hidden',
         }}>
        <div className=' py-10'>
            <h1 className='text-3xl mb-5 font-bold'>We Delivery on Next Day from 10:00 AM to 08:00 PM</h1>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-400 hover:to-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">Order Now</Button>
        </div>
    </div>
  )
}
