
import { useRef, useState, Fragment, useEffect } from 'react'

import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

import { getBranches } from '../services/toy.service.js'
import { showErrorMsg } from '../services/event-bus.service.js';


export function ToyBranchMap() {
    const branches = getBranches()
    console.log('branches:', branches)
    const map = useMap()
    // usewRef
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [coords, setCoords] = useState({ lat: 32.0853, lng: 34.7818 })
    const [selectedBranch, setSelectedBranch] = useState(null)

    function onPanToBranch(position) {
        console.log('position:', position)
        setSelectedBranch(position)
    }

    function handleClick(ev) {
        console.log('ev:', ev)
        const { latLng } = ev.detail;
        setCoords(latLng);
    }

    useEffect(() => {
        if (map && selectedBranch) {
            map.panTo(selectedBranch.position)
            map.setZoom(12)
        }
    }, [map, selectedBranch])




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

            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
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
                                    ref={markerRef}
                                    position={branch.position}
                                    onClick={() => setSelectedBranch(branch._id)}
                                >
                                    <Pin scale={1.1} />

                                    {isActive && (
                                        <InfoWindow
                                            position={branch.position}
                                            maxWidth={200}
                                            anchor={branch.position}
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