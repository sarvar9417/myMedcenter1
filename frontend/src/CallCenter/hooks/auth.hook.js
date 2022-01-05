
import { useCallback, useEffect, useState } from 'react'

const storageName = 'callcenterData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [callcenterId, setCallCenterId] = useState(null)

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setCallCenterId(id)

        localStorage.setItem(storageName, JSON.stringify({
            callcenterId: id,
            token: jwtToken
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setCallCenterId(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.operatorId)
        }
    }, [login])

    return { login, logout, token, callcenterId }
}
