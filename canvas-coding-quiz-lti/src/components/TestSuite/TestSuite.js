import React from 'react';
import TestComponent from '../TestComponent/TestComponent'

const TestSuite  = (props) => {
  const { tests } = props
  return (
    <div>
      {tests.map( (test, index) => <TestComponent key={index} test={test[1].replace("');", "")} />)}
    </div>
  )
}

export default TestSuite