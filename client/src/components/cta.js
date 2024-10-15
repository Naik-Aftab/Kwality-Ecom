import React from 'react'
import Button from '@mui/material/Button';

export const Cta = () => {
  return (
    <div className='container flex justify-center items-center text-center rounded-2xl my-5' style={{backgroundImage:'url(banner-bg.png)', backgroundColor: '#d3ebc0', height:'300px',
        backgroundBlendMode: 'overlay', 
        backgroundSize: 'cover', }}>
        <div className=' py-10'>
            <h1 className='text-3xl mb-5 font-bold'>We Delivery on Next Day from 10:00 AM to 08:00 PM</h1>
            <Button variant="contained">Order Now</Button>
        </div>
    </div>
  )
}
