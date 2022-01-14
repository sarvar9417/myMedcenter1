
import { useCallback, useEffect, useState } from 'react'

const storageName = 'counteragentData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [counteragent, setCounteragent] = useState(null)
    const [counteragentId, setCounterAgentId] = useState(null)

    const login = useCallback((jwtToken, id, counteragent) => {
        setToken(jwtToken)
        setCounterAgentId(id)
        setCounteragent(counteragent)
        localStorage.setItem(storageName, JSON.stringify({
            counteragentId: id,
            token: jwtToken,
            counteragent: counteragent
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setCounterAgentId(null)
        setCounteragent(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.counteragentId, data.counteragent)
        }
    }, [login])

    return { login, logout, token, counteragentId, counteragent }
}
