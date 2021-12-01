
import { useCallback, useEffect, useState } from 'react'

const storageName = 'reseptionData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [reseptionId, setReseptionId] = useState(null)

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setReseptionId(id)

        localStorage.setItem(storageName, JSON.stringify({
            reseptionId: id,
            token: jwtToken
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setReseptionId(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.reseptionId)
        }
    }, [login])

    return { login, logout, token, reseptionId }
}
