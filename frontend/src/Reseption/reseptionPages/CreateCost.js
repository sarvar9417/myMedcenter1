import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import 'react-toastify/dist/ReactToastify.css'
import { Loader } from '../components/Loader'
import { toast } from 'react-toastify'

toast.configure()
export const CreateCost = () => {
    const { loading, request, error, clearError } = useHttp()
    const history = useHistory()
    // const [costs, setCosts] = useState([])
    const [form, setForm] = useState({
        price: '',
        comment: ''
    })

    const changeHandlar = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const notify = (e) => {
        toast.error(e)
    }

    const createHandler = async () => {
        try {
            const data = await request('/api/cost/register', 'POST', { ...form })
            console.log(data)
            history.push('/reseption/costs')
        } catch (e) { }
    }

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
    }, [error, clearError])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container rounded bg-white mt-5 mb-5" >
            <div className="row">
                <div className="col-md-12 offset-md-0 col-lg-6 border-right offset-lg-3">
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-right">Xarajatlarni ro'yxatga olish</h4>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <label className="labels">
                                </label>
                                <input
                                    onChange={changeHandlar}
                                    type="number"
                                    name='price'
                                    className="form-control"
                                    placeholder="Xarajatlar miqdorini kiriting"
                                />
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="floatingTextarea2">

                                </label>
                                <textarea
                                    name="comment"
                                    onChange={changeHandlar}
                                    className="form-control"
                                    placeholder="Xarajatning maqsadini kiriting"
                                >
                                </textarea>
                            </div>

                        </div>
                        <div className="mt-5 text-center">
                            <button
                                onClick={createHandler}
                                className="btn btn-primary profile-button"
                            >
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
