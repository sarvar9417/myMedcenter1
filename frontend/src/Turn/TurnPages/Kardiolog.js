import React, { useCallback, useState } from 'react'
import { useHttp } from '../hooks/http.hook'

export const Kardiolog = () => {

    const { request } = useHttp()

    const [offline, setOffline] = useState(0)

    const getOffline = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/turn/${'Kardiolog'}`, 'GET', null)
            if (!fetch) {
                setOffline(0)
            } else {
                if (fetch.turn !== offline) {
                    setOffline(fetch.turn)
                }
            }
        } catch (e) {

        }
    }, [request, offline, setOffline])

    setInterval(() => {
        getOffline()
    }, 1000)


    return (
        <div className="kard" style={{ width: "90%", margin: "auto" }}>
            <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                <h2 className="text">KARDIOLOG</h2>
                <p></p>
            </div>
            <div className="row">
                <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                    <h5>Navbat</h5>
                    <h1 style={{ color: "green" }}>{offline}</h1>
                </div>
                <div className="col-4" style={{ textAlign: "center" }}>
                    <div className="image">
                        <h5>Xona</h5>
                        <h1 style={{ color: "#e3342f" }}>7</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
