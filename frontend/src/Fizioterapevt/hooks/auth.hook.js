
import { useCallback, useEffect, useState } from 'react'

const storageName = 'fizioterapevtData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [fizioterapevtId, setFizioterapevtId] = useState(null)

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setFizioterapevtId(id)

        localStorage.setItem(storageName, JSON.stringify({
            fizioterapevtId: id,
            token: jwtToken
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setFizioterapevtId(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.fizioterapevtId)
        }
    }, [login])

    return { login, logout, token, fizioterapevtId }
}
