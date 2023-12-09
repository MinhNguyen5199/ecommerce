import Image from 'next/image'
import React from 'react'

export default function Carousel() {
  return (
    <div className="hero min-h-[92vh]" style={{backgroundImage: 'url(https://res.cloudinary.com/minhnguyen/image/upload/v1701758968/1000_F_442215355_AjiR6ogucq3vPzjFAAEfwbPXYGqYVAap_yizimf.jpg)', height: 'auto'}}>
  <div className="hero-overlay bg-opacity-40"></div>
  <div className="hero-content text-center text-neutral-content">
    <div className="max-w-md">
      <h1 className="mb-5 text-6xl font-bold text-blue-300">Best Rental GAME In City</h1>
      <p className="mb-5 text-lime-300 font-mono text-xl">Welcome to BB GAME GARDEN, your go-to rental game store for the ultimate gaming experience! BB GAME GARDEN is more than just a store—it is a gaming haven where your adventure begins!</p>
    </div>
  </div>
</div>
  )
}
