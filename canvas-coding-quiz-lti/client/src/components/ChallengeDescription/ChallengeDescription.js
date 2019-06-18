import React from 'react'
import './ChallengeDescription.css'

const ChallengeDescription = ({index, description}) => {
  return (
    <p key={index} dangerouslySetInnerHTML={{ __html: description }} />
  )
}

export default ChallengeDescription
