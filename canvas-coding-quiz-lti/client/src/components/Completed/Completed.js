import React from 'react'
import './Completed.css'

const Completed = (props) => {
  return (
    <div className="Completed">
      <h1>{props.title}</h1>
      <h1>COMPLETED <span role='img' aria-label="Checkbox">✅</span></h1>
      <p>Please navigate back to the assignments</p>
    </div>
    
  )
}

export default Completed
