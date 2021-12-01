import React from 'react'
import { DoctorRoutes } from './DoctorRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'
export const Doctor = () => {
    localStorage.removeItem('reseptionData')
    localStorage.removeItem('cashierData')
    localStorage.removeItem('directorData')
    const { login, token, logout, doctorId, doctor } = useAuth()
    // const isAuthenticated = true
    const isAuthenticated = !!token
    const doctorRouter = DoctorRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ login, logout, token, doctorId, isAuthenticated, doctor }} >
            <Router>
                {isAuthenticated && <Navbar />}
                {doctorRouter}
            </Router>
        </AuthContext.Provider>
    )
}


