import React from 'react';

const TestComponent  = (props) => {
  const { test, key} = props
  return (
    <p key={key} dangerouslySetInnerHTML={{ __html: test }}></p>
  )
}

export default TestComponent