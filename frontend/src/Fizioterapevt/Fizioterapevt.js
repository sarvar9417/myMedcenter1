import React from 'react'
import { FizioterapevtRoutes } from './FizioterapevtRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'
export const Fizioterapevt = () => {
    localStorage.removeItem('directorData')
    localStorage.removeItem('doctorData')
    localStorage.removeItem('cashierData')
    localStorage.removeItem('callcenterData')
    localStorage.removeItem('reseptionData')
    localStorage.removeItem('medsestraData')
    const { login, token, logout, fizioterapevtId } = useAuth()
    const isAuthenticated = !!token
    const fizioterapevtRouter = FizioterapevtRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ login, logout, token, fizioterapevtId, isAuthenticated }} >
            <Router>
                {isAuthenticated && <Navbar />}
                {fizioterapevtRouter}
            </Router>
        </AuthContext.Provider>
    )
}



