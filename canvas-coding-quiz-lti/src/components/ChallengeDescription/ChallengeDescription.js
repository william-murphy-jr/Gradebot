import React from 'react'
import './ChallengeDescription.css'


const ChallengeDescription = (props) => {
  const { index, description } = props
  return ( 
    <p key={index} dangerouslySetInnerHTML={{ __html: description }}></p>
  )
}

export default ChallengeDescription