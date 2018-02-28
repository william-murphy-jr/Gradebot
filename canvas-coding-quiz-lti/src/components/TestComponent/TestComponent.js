import React, { Component } from 'react';

class TestComponent  extends Component {
  
  state = {
    passed: false
  }
  makeMessage = (test) => {
    const splitArr = this.props.test.split("'message:");
    return splitArr[1].replace("');", "")
  }

  // componentDidMount = () => {
  //   this.props.runTest(this.props.test).then(res => {this.setState({ passed: res.data})})
  // }
  
  render() {
    const { index, testDescription, runTest, test} = this.props
    runTest(test).then(res => {this.setState({ passed: res.data})})
    return (
      <p key={index} style={this.state.passed ? {"color" : "green"} : {"color" : "red"}}dangerouslySetInnerHTML={{ __html: this.makeMessage(testDescription) }}></p>
    )
  }
}

export default TestComponent
