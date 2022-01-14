import React from 'react'
import { MedsestraRoutes } from './MedsestraRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'
export const Medsestra = () => {
    localStorage.removeItem('directorData')
    localStorage.removeItem('doctorData')
    localStorage.removeItem('cashierData')
    localStorage.removeItem('callcenterData')
    localStorage.removeItem('reseptionData')
    localStorage.removeItem('fizioterapevtData')
    localStorage.removeItem('counteragentData')
    const { login, token, logout, medsestraId } = useAuth()
    const isAuthenticated = !!token
    const medsestraRouter = MedsestraRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ login, logout, token, medsestraId, isAuthenticated }} >
            <Router>
                {isAuthenticated && <Navbar />}
                {medsestraRouter}
            </Router>
        </AuthContext.Provider>
    )
}



