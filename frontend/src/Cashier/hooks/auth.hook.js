
import { useCallback, useEffect, useState } from 'react'

const storageName = 'cashierData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [cashierId, setCashierId] = useState(null)
    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setCashierId(id)

        localStorage.setItem(storageName, JSON.stringify({
            cashierId: id,
            token: jwtToken
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setCashierId(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.cashierId)
        }
    }, [login])

    return { login, logout, token, cashierId }
}
