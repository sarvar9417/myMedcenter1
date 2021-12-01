import React from 'react'
import { DirectorRoutes } from './DirectorRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'

export const Director = () => {
    localStorage.removeItem('doctorData')
    localStorage.removeItem('cashierData')
    localStorage.removeItem('reseptionData')
    const { login, token, logout, directorId, director } = useAuth()
    const isAuthenticated = !!token
    const directorRouter = DirectorRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ login, logout, token, directorId, director, isAuthenticated }} >
            <Router>
                {isAuthenticated && <Navbar />}
                {directorRouter}
            </Router>
        </AuthContext.Provider>
    )
}



