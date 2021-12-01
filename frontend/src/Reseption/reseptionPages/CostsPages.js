import React, { useCallback, useEffect, useState } from 'react'
import { Loader } from '../components/Loader';
import { useHttp } from '../hooks/http.hook';
import { toast } from 'react-toastify'
const mongoose = require('mongoose');

toast.configure()
export const CostsPages = () => {
    let k = 0;

    const { loading, request } = useHttp()

    const [costs, setCosts] = useState([]);

    const allCosts = useCallback(async () => {
        try {
            const fetch = await request('/api/cost/', 'GET', null)
            setCosts(fetch)
        } catch (e) {

        }
    }, [request])

    useEffect(() => {
        allCosts()
    }, [allCosts])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container m-5" >
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">№</th>
                        <th scope="col">Vaqti</th>
                        <th scope="col">Summasi</th>
                        <th scope="col">Maqsad</th>
                    </tr>
                </thead>
                <tbody>
                    {costs.map((cost, key) => {
                        k++;
                        return (
                            <tr key={key} >
                                <td>{k}</td>
                                <td>{new mongoose.Types.ObjectId(cost._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(cost._id).getTimestamp().toLocaleTimeString()}</td>
                                <td>{cost.price}</td>
                                <td>{cost.comment}</td>
                            </tr>
                        )

                    })}
                </tbody>
            </table>
        </div>
    )
}
