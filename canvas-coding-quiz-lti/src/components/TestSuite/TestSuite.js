import React from 'react';
import TestComponent from '../TestComponent/TestComponent'

const TestSuite  = (props) => {
  return (
    <div>
      {props.tests.map( t => <TestComponent test={t[1].replace("');", "")} />)}
    </div>
  )
}

export default TestSuite