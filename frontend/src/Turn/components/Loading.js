import React from 'react'
import gif from '../../gif/4.gif'
export const Loading = () => {
  return (
    <>
      <div className="m-auto text-center mt-5" >
        <img alt="loader" style={{marginTop: "14%"}} width="200px" src={gif} />
      </div>
    </>
  )
}