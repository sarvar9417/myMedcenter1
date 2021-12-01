import React from 'react'
import { TurnRoutes } from './TurnRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
export const Turn = () => {
    localStorage.removeItem('reseptionData')
    localStorage.removeItem('cashierData')
    const { login, token, logout, turnId, turn } = useAuth()
    // const isAuthenticated = true
    const isAuthenticated = !!token
    const turnRouter = TurnRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ login, logout, token, turnId, isAuthenticated, turn }} >
            <Router>
                {turnRouter}
            </Router>
        </AuthContext.Provider>
    )
}