import React, { Component } from 'react';

class TestComponent  extends Component {
  
  state = {
    passed: false
  }
  makeMessage = (test) => {
    const splitArr = this.props.test.split("'message:");
    return splitArr[1].replace("');", "")
  }

  componentDidMount = () => {
    this.props.runTest(this.props.test).then(res => {this.setState({ passed: res.data})})
    
  }
  // componentDidUpdate = () => {
  //   this.props.runTest(this.props.test).then(res => {this.setState({ passed: res.data})})
  // }
  
  render() {
    const { index, testDescription, runTest, test, passed} = this.props
    // runTest(test).then(res => {
    //   this.setState({ 
    //     passed: res.data
    // })})
    return (
      <p key={index} style={
        this.props.passing[index] ? {"color" : "green"} : {"color" : "red"}}dangerouslySetInnerHTML={{ __html: this.makeMessage(testDescription) }}></p>
    )
  }
}

export default TestComponent
