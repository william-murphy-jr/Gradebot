import React, { Component } from 'react'
import './Completed.css'

const Completed = (props) => {
  return (
    <div className="Completed">
      <h1>{props.title}</h1>
      <h1>COMPLETED</h1>
      <p>Please navigate back to the assignments</p>
    </div>
    
  )
}

export default Completed