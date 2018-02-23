import React from 'react';

const TestComponent  = (props) => {
  return (
    <p dangerouslySetInnerHTML={{ __html: props.test }}></p>
  )
}

export default TestComponent