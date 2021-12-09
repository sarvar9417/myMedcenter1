import React from 'react'
import { TurnRoutes } from './TurnRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
export const Turn = () => {
    const turnRouter = TurnRoutes()
    return (
        <AuthContext.Provider value={{ }} >
            <Router>
                {turnRouter}
            </Router>
        </AuthContext.Provider>
    )
}