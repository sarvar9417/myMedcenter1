import React from 'react'
import { CounterAgentRoutes } from './CounterAgentRoute'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'
export const CounterAgent = () => {
    localStorage.removeItem('directorData')
    localStorage.removeItem('doctorData')
    localStorage.removeItem('cashierData')
    localStorage.removeItem('callcenterData')
    localStorage.removeItem('medsestraData')
    localStorage.removeItem('fizioterapevtData')
    localStorage.removeItem('reseptionData')
    const { login, token, logout, counteragentId, counteragent } = useAuth()
    const isAuthenticated = !!token
    const counteragentRouter = CounterAgentRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ login, logout, token, counteragentId, isAuthenticated, counteragent }} >
            <Router>
                {isAuthenticated && <Navbar />}
                {counteragentRouter}
            </Router>
        </AuthContext.Provider>
    )
}



