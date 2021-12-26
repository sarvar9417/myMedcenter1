import React from 'react'
import { MarketingMenu } from './MarketingMenu'

export const Marketing = ({component}) => {
    return (
        <div>
            <MarketingMenu />
            {component}
        </div>
    )
}
