import React from 'react'
import TestComponent from '../TestComponent/TestComponent'
import PropTypes from 'prop-types'

const TestSuite  = (props) => {
  const { tests, passing } = props

  return (
    <div>
      {tests.map( (test, index) => <TestComponent passing={passing} 
      index={index} key={index} test={test} />)}
    </div>
  )
}

TestSuite.propTypes = {
  tests: PropTypes.array.isRequired,
  passing: PropTypes.array.isRequired
};

export default TestSuite
