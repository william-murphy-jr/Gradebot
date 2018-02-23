import React from 'react'
import './ChallengeInstruction.css'


const ChallengeInstruction = (props) => {
  const { key, description } = props
  return ( 
    <p key={key} dangerouslySetInnerHTML={{ __html: description }}></p>
  )
}

export default ChallengeInstruction