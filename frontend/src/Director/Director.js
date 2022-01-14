import React from 'react'
import { DirectorRoutes } from './DirectorRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'

export const Director = () => {
    localStorage.removeItem('reseptionData')
    localStorage.removeItem('doctorData')
    localStorage.removeItem('cashierData')
    localStorage.removeItem('callcenterData')
    localStorage.removeItem('medsestraData')
    localStorage.removeItem('fizioterapevtData')
    localStorage.removeItem('counteragentData')
    const { login, token, logout, directorId, director } = useAuth()
    const isAuthenticated = !!token
    const directorRouter = DirectorRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ login, logout, token, directorId, director, isAuthenticated }} >
            <Router>
                {directorRouter}
            </Router>
        </AuthContext.Provider>
    )
}



