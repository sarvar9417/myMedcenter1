import React, { useCallback, useState } from 'react'
import { useHttp } from '../hooks/http.hook'

export const DirectionTurn = ({ section, room }) => {
    const { request } = useHttp()

    const [offline, setOffline] = useState(0)

    const getOffline = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/turn/${section}`, 'GET', null)
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

    setTimeout(() => {
        // localStorage.clear()
        // window.localStorage.clear()
        getOffline()
    }, 5000)


    return (
        <div className="kard" style={{ width: "90%", margin: "auto" }}>
            <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                <h2 className="text">{section}</h2>
                <p></p>
            </div>
            <div className="row">
                <div className="col-7" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                    <h5>Navbat</h5>
                    <h1 style={{ color: "green" }}>{offline}</h1>
                </div>
                <div className="col-4" style={{ textAlign: "center" }}>
                    <div className="image">
                        <h5>Xona</h5>
                        <h1 style={{ color: "#e3342f" }}>{room}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
