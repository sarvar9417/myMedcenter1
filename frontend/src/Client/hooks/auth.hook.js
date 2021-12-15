
import { useCallback, useEffect, useState } from 'react'

const storageName = 'directorData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [directorId, setDirectorId] = useState(null)
    const [director, setDirector] = useState(null)
    const login = useCallback((jwtToken, id, director) => {
        setToken(jwtToken)
        setDirectorId(id)
        setDirector(director)

        localStorage.setItem(storageName, JSON.stringify({
            directorId: id,
            token: jwtToken,
            director: director
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setDirectorId(null)
        setDirector(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.directorId, data.director)
        }
    }, [login])

    return { login, logout, token, directorId, director }
}
