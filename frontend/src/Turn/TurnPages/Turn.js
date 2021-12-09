import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { toast } from "react-toastify"
import './turn.css'
import { Loading } from '../components/Loading'
import { DirectionTurn } from './DirectionTurn'

toast.configure()
export const Turn = () => {

    // So'rovlar yuklanishi
    const { request, loading, error, clearError } = useHttp()
    const [directions, setDirections] = useState()

    const getDirections = useCallback(async () => {
        try {
            const data = await request("/api/direction", "GET", null)
            if (data.message) {
                return notify(data.message)
            }
            setDirections(data)
        } catch (e) {
            notify(e)
        }
    }, [request, setDirections])

    // Vaqt hisoblagichi
    const [time, setTime] = useState(new Date().toLocaleTimeString())
    setInterval(() => {
        setTime(new Date().toLocaleTimeString())
    }, 1000)

    //Xatoliklar chiqaruvi
    const notify = (e) => {
        toast.error(e)
    }

    // Componentlar chaqiruvi
    useEffect(() => {
        if (!directions) {
            getDirections()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [getDirections, notify, clearError, directions])

    if (loading) {
        return <Loading />
    }

    return (
        <div className="body">
            <div className="cc mb-5">
                <div className="row text-white" style={{ backgroundColor: "#45D3D3" }}>
                    <div className="col-lg-4 d-lg-block  text-center d-none" >
                        <h1 className="p-4">{new Date().toLocaleDateString()}</h1>
                    </div>
                    <div className="col-lg-4 d-md-block d-none" style={{ textAlign: "center" }}>
                        <h1 className="p-4">MedicalCenter</h1>
                    </div>
                    <div className="col-lg-4 text-md-center">
                        <h1 className="p-4">{time}</h1>
                    </div>
                </div>
            </div>
            <div className="row mb-4" style={{ overflowX: "hidden" }}>
                {directions && directions.map((direction, index) => {
                    return (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-2" key={index}>
                            <DirectionTurn section={direction.value} />
                        </div>)
                })}
            </div>
            <div className="row mb-4" style={{ overflowX: "hidden" }}>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
            </div>
            <div className="row mb-4" style={{ overflowX: "hidden" }}>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
            </div>
            <div className="d-inline-none rounded-circle" style={{ right: "30px", bottom: "30px", position: "fixed" }}>

            </div>
        </div>
    )
}