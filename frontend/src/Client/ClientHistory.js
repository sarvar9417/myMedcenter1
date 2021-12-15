import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useHttp } from './hooks/http.hook'
import { toast } from 'react-toastify'
import { Loader } from '../Reseption/components/Loader'
import {  savePDF } from '@progress/kendo-react-pdf'
import { Header } from './Header'

toast.configure()
export const ClientHistory = () => {
    const { request, loading, error, clearError } = useHttp()
    const clientId = useParams().id
    const [client, setClient] = useState({
        lastname: "",
        firstname: "",
        fathername: ""
    })
    const [sections, setSections] = useState()
    const contentArea = useRef(null)

    const createSizeHistory = (event) => {
        savePDF(
            contentArea.current,
            {
                paperSize: "A4",
                repeatHeaders: true,
                fileName: client.lastname+client.firstname+client.fathername,
                margin: "2cm"
            },
        )
    }

    const getClient = useCallback(async () => {
        try {
            const data = await request(`/api/clienthistorys/client/${clientId}`, 'GET', null)
            setClient(data)
        } catch (e) {
        }
    }, [request, clientId, setClient])

    const getSections = useCallback(async () => {
        try {
            const data = await request(`/api/clienthistorys/sections/${clientId}`, 'GET', null)
            setSections(data)
        } catch (e) {
        }
    }, [request, clientId, setSections])

    const notify = (e) => {
        toast.error(e)
    }

    useEffect(() => {
        if (client.lastname === "") {
            getClient()
        }
        if (!sections) {
            getSections()
        }
        if (error) {
            notify(error)
            clearError()
        }

    }, [notify, clearError])

    if (loading) {
        return <Loader />
    }

    const headers = () => {
        return <div>
            <h1>Hedares</h1>
        </div>
    }
    return (
        <div>
            <div ref={contentArea}>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
                <h1>Salom</h1>
            </div>
            <button onClick={createSizeHistory}>Save</button>
        </div>
    )
}
