import React from 'react'
import './AssignmentDescription'


const AssignmentDescription = (props) => {
  const { key, description } = props
  return ( 
    <p key={key} dangerouslySetInnerHTML={{ __html: description }}></p>
  )
}

export default AssignmentDescription