import { useEffect, useState } from 'react'
import { Chart } from '../cmps/Chart.jsx'
import { toyService } from '../services/toy.service.js'

export function Dashboard() {

    const [toys, setToys] = useState([])
    const [priceStats, setPriceStats] = useState([])

    useEffect(() => {
        toyService.query()
            .then(setToys)
        toyService.getPriceStats()
            .then(setPriceStats)
    }, [])


    return (
        <section className="dashboard">
            <h1>Dashboard</h1>
            <h2>Statistics for {toys.length} Toys</h2>
            <hr />
            <h4>By Price</h4>
            <Chart data={priceStats} />
        </section>
    )
}