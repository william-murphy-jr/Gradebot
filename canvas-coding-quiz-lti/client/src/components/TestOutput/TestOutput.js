import React from 'react'
import './TestOutput.css'

const TestOutput = ({index, test, passing}) =>
  <div className='test-description'>
    <span> {passing[index] ? '✅' : '❌' }</span>
    <p key={index} dangerouslySetInnerHTML={{ __html: test.text }} />
  </div>

export default TestOutput
