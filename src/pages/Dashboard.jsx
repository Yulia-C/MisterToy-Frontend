import { useEffect, useState } from 'react'
import { Chart } from '../cmps/Chart.jsx'
import { toyService } from '../services/toy.service.js'
import { LabelDoughnutChart } from '../cmps/LabelDoughnutChart.jsx'
// import { toyService } from '../services/toy.service.remote.js'

export function Dashboard() {

    const [toys, setToys] = useState([])
    const [priceStats, setPriceStats] = useState([])
    const [labelCounts, setLabelCounts] = useState(null)

    useEffect(() => {
        toyService.query()
            .then(setToys)
        toyService.getLabelCounts()
            .then(setLabelCounts)
            .catch(err => console.log('err:', err))
    }, [])
    console.log('labelCounts:', labelCounts)

    if (!labelCounts) return <div className="loader"></div>

    return (
        <section className="pie-chart">
            <h1>Dashboard</h1>
            <h2>Statistics for {toys.length} Toys</h2>
            <hr />
            <h4>Toys In Stock By Labels</h4>
            {/* <Chart data={priceStats} /> */}
            <LabelDoughnutChart labelCounts={labelCounts} />
        </section>
    )
}