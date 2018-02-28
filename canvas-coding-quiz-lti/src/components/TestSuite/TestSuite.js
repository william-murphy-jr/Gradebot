import React from 'react';
import TestComponent from '../TestComponent/TestComponent'

const TestSuite  = (props) => {
  const { tests, runTest } = props
  console.log(tests)
  return (
    <div>
      {tests.map( (test, index) => <TestComponent index={index} key={index} test={test} runTest={runTest} testDescription={test} />)}
    </div>
  )
}

export default TestSuite

// [1].replace("');", "")