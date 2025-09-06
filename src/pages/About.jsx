import { useRef, useState, Fragment, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'

import { utilService } from '../services/util.service.js'
import { AboutTeam } from '../cmps/AboutTeam.jsx'
import { AboutVision } from '../cmps/AboutVision.jsx'

import { ToyBranchMap } from '../cmps/ToyBranchMap.jsx';

export function About() {


    return (
        <section className="container">
            <h4>
                At Mister Toy, we believe that play is essential to a child’s development — and to their joy!
                Founded with a passion for creativity and imagination, our toy store is dedicated to bringing smiles to kids (and kids at heart)
                by offering a handpicked collection of quality toys for all ages. From timeless classics to the latest trends, each toy on our shelves is chosen with care, safety, and fun in mind.
                Whether you're looking for educational games, cuddly companions, or just something to spark a little adventure, Mister Toy is your go-to destination.
                Because when kids play, magic happens — and we’re proud to be part of that.
            </h4>

            <ToyBranchMap />
        </section>
    )
}

