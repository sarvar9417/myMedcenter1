
import { useCallback, useEffect, useState } from 'react'

const storageName = 'medsestraData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [medsestraId, setMedsestraId] = useState(null)

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setMedsestraId(id)

        localStorage.setItem(storageName, JSON.stringify({
            medsestraId: id,
            token: jwtToken
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setMedsestraId(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.medsestraId)
        }
    }, [login])

    return { login, logout, token, medsestraId }
}
