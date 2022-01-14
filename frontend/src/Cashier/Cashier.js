import React from 'react'
import { CashierRoutes } from './CashierRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'
export const Cashier = () => {
    localStorage.removeItem('directorData')
    localStorage.removeItem('doctorData')
    localStorage.removeItem('reseptionData')
    localStorage.removeItem('callcenterData')
    localStorage.removeItem('medsestraData')
    localStorage.removeItem('fizioterapevtData')
    localStorage.removeItem('counteragentData')
    const { login, token, logout, cashierId } = useAuth()
    const isAuthenticated = !!token
    const cashierRouter = CashierRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ login, logout, token, cashierId, isAuthenticated }} >
            <Router>
                {isAuthenticated && <Navbar />}
                {cashierRouter}
            </Router>
        </AuthContext.Provider>
    )
}