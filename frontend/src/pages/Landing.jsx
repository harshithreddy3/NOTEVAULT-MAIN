import React from 'react'
import Navbar from "../components/Navbar"
import Hero from '../components/Hero'
import Features from '../components/Features'


const Landing = () => {
    return (
        <div >
            <Navbar display={false} />
            <Hero />
            <Features />
        </div>
    )
}

export default Landing