import React from 'react'
import { CallCenterRoutes } from './CallCenterRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'
export const CallCenter = () => {
    localStorage.removeItem('directorData')
    localStorage.removeItem('doctorData')
    localStorage.removeItem('cashierData')
    localStorage.removeItem('reseptionData')
    const { login, token, logout, callcenterId } = useAuth()
    const isAuthenticated = !!token
    const callcenterRouter = CallCenterRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ login, logout, token, callcenterId, isAuthenticated }} >
            <Router>
                {isAuthenticated && <Navbar />}
                {callcenterRouter}
            </Router>
        </AuthContext.Provider>
    )
}



