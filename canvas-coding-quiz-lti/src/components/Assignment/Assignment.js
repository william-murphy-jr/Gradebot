import React from 'react';


const Assignment = (props) => {
  const { key, description } = props
  return ( 
    <p key={key} dangerouslySetInnerHTML={{ __html: description }}></p>
  )
}

export default Assignment