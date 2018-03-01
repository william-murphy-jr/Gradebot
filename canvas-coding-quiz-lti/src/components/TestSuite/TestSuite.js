import React from 'react';
import TestComponent from '../TestComponent/TestComponent'

const TestSuite  = (props) => {
  const { tests, runTest, passed, passing } = props
  console.log(tests)
  return (
    <div>
      {tests.map( (test, index) => <TestComponent passing=
      {passing} index={index} key={index} test={test} runTest={runTest} testDescription={test} />)}
    </div>
  )
}

export default TestSuite
