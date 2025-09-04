
import { useRef, useState, Fragment, useEffect } from 'react'

import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

import { getBranches } from '../services/toy.service.js'
import { showErrorMsg } from '../services/event-bus.service.js';

const API_KEY = 'AIzaSyC1jy2FztmDwfLJH78wxACRED-LKl3i6EI'

export function ToyBranchMap() {
    const branches = getBranches()
    console.log('branches:', branches)

    const [coords, setCoords] = useState({ lat: 32.0853, lng: 34.7818 })
    const [selectedBranch, setSelectedBranch] = useState(null)

    function onPanToBranch(position) {
        setCoords(position)
    }

    function handleClick(ev) {
        const { latLng } = ev.detail;

        ev.map.panTo(latLng);
        ev.map.zoom(13)
        setCoords(latLng);
    }

    useEffect(() => {
        // const map = useMap()
        // console.log('map:', map)

    }, [])



    return (
        <>
            <section>
                <h1>We have 5 branches spread out in Israel and you can find them right here:</h1>
                <div>
                    {branches.map(branch => (
                        <button
                            onClick={() => onPanToBranch(branch.position)}
                            key={branch._id}
                        >
                            {branch.city}
                        </button>
                    ))}
                </div>
            </section>

            <APIProvider apiKey={API_KEY}>
                <div style={{ height: '400px', width: '500px' }}>
                    <Map
                        onClick={handleClick}
                        defaultCenter={coords}
                        zoom={7}
                        style={{ height: '100%', width: '100%' }}
                        mapId="DEMO_MAP_ID"
                    >
                        {branches.map(branch => {
                            const isActive = selectedBranch === branch._id;

                            return (
                                <AdvancedMarker
                                    key={branch._id}
                                    // ref={markerRef}
                                    position={branch.position}
                                    onClick={() => setSelectedBranch(branch._id)}
                                >
                                    <Pin scale={1.1} />

                                    {isActive && (
                                        <InfoWindow
                                            position={branch.position}
                                            maxWidth={200}
                                            onCloseClick={() => setSelectedBranch(null)}
                                        >
                                            <div>
                                                <h4>{branch.city}</h4>
                                                <p>{branch.address}</p>
                                                <p>{branch.hours}</p>
                                                <p>Phone number: {branch.phoneNum}</p>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </AdvancedMarker>
                            );
                        })}
                    </Map>
                </div>
            </APIProvider>
        </>
    )
}