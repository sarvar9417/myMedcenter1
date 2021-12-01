
import { useCallback, useEffect, useState } from 'react'

const storageName = 'doctorData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [doctorId, setDoctorId] = useState(null)
    const [doctor, setDoctor] = useState(null)
    const login = useCallback((jwtToken, id, doctor) => {
        setToken(jwtToken)
        setDoctorId(id)
        setDoctor(doctor)

        localStorage.setItem(storageName, JSON.stringify({
            doctorId: id,
            token: jwtToken,
            doctor: doctor
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setDoctorId(null)
        setDoctor(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.doctorId, data.doctor)
        }
    }, [login])

    return { login, logout, token, doctorId, doctor }
}
