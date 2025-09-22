
import { useRef, useState, Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps';

import { showErrorMsg } from '../services/event-bus.service.js';
import { loadBranches } from '../store/actions/branch.actions.js';

export function ToyBranchMap() {
    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <MapController />
            </APIProvider>
        </>
    )
}

function MapController() {

    const branches = useSelector(storeState => storeState.branchModule.branches)

    useEffect(() => {
       fetchBranches()
    }, [])

    async function fetchBranches() {
        try {
           await loadBranches()
        } catch (error) {
            showErrorMsg('Cannot load branches...')
        }
    }

    const markerRefs = useRef({})
    const [coords, setCoords] = useState(null)
    const [selectedBranch, setSelectedBranch] = useState(null)
    const map = useMap()

    function onPanToBranch(branch) {
        setSelectedBranch(branch)
    }

    useEffect(() => {
        if (map && selectedBranch) {
            map.panTo(selectedBranch.position)
            map.setZoom(10);
        }
    }, [map, selectedBranch])


    function handleClick(event) {
        const latLng = event.detail.latLng
        setCoords(latLng)
    }

    if (!branches) return <div className="loader">Loading branches...</div>;

    return (

        <section className="container">

            <section>
                <h4>We have 5 branches spread out in Israel and you can find them right here:</h4>
                <div>
                    {branches.map(branch => (
                        <button
                            onClick={() => onPanToBranch(branch)}
                            key={branch._id}
                        >
                            {branch.city}
                        </button>
                    ))}
                </div>
            </section>

            <div className="map-container">
                <Map
                    disableDefaultUI={true}
                    onClick={handleClick}
                    defaultCenter={{ lat: 32.0853, lng: 34.7818 }}
                    defaultZoom={7}
                    style={{ height: '100%', width: '100%' }}
                    mapId="DEMO_MAP_ID"
                >
                    {branches.map(branch => {
                        const isActive = selectedBranch?._id === branch._id;
                        return (
                            <AdvancedMarker
                                key={branch._id}
                                ref={(el) => markerRefs.current[branch._id] = el}
                                position={branch.position}
                                onClick={() => setSelectedBranch(branch)}
                            >
                                <Pin  {...(isActive
                                    ? { scale: 1.7, background: 'dodgerblue', glyphColor: 'hotpink', borderColor: 'black' }
                                    : { scale: 1.1 }
                                )}  >


                                    {isActive && (
                                        <InfoWindow
                                            maxWidth={200}
                                            anchor={markerRefs.current[selectedBranch._id]}
                                            onCloseClick={() => setSelectedBranch(null)}
                                        >
                                            <div>
                                                <h4>{selectedBranch.city}</h4>
                                                <p>{selectedBranch.address}</p>
                                                <p>{selectedBranch.hours}</p>
                                                <p>Phone number: {selectedBranch.phoneNum}</p>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </Pin>
                            </AdvancedMarker>
                        )
                    })}
                </Map>
            </div>

        </section>
    )
}