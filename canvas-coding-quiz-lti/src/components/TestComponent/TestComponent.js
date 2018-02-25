import React, { Component } from 'react';

class TestComponent  extends Component {
  
  makeMessage = (test) => {
    const splitArr = this.props.test.split("'message:");
    return splitArr[1].replace("');", "")
  }
  
  render() {
    const { testDescription, key ,runTest, test} = this.props
    return (
      <p key={key} style={runTest(test) ? {"color" : "green"} : {"color" : "red"}}dangerouslySetInnerHTML={{ __html: this.makeMessage(testDescription) }}></p>
    )
  }
}

export default TestComponent