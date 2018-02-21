import './App.css';

import AssignmentDescription from './components/AssignmentDescription/AssignmentDescription'
import React, { Component } from 'react';
import { assert } from 'chai';
import AceEditor from 'react-ace';
import axios from 'axios'
import runTest from './testframe.js'
window.assert = assert

import 'brace/mode/javascript';
import 'brace/theme/monokai';

class App extends Component {

  state = {
    assignment: [],
    description: [],
    challengeSeed: [],
    errorMsg: "",
    passed: false
  }

  componentDidMount() {
    this._editor = this.ace.editor
    this._editor.$blockScrolling = Infinity;
    axios.get('/lti')
      .then(res => {
        this.challengeSeed = res.data.initstate.assignment.challengeSeed
        const assignment = res.data.initstate.assignment;
        const description = res.data.initstate.assignment.description
        this.setState({
          assignment, 
          description, 
          challengeSeed: this.challengeSeed 
        });
      })
  }

  onReset = () => {
    this.setState(prevState => ({
      challengeSeed: this.challengeSeed,
      errorMsg: ""
    }));
  }

  onCheck = () => {
    var p1
    var code = this._editor.getValue()

    // eval()
    let passed = true
    let errorMsg;
    // eval(this.state.assignment.tail.join('\n'))
    this.state.assignment.tests.forEach((test) => {
      try {
        eval(code + test)
      } catch(e) {
        errorMsg = e.message.replace('message:', '')
        passed = false
      }
    })
    this.setState({
      errorMsg,
      passed,
      challengeSeed:[code]
    })
  }

  render() {
    const { passed, assignment, description, challengeSeed, errorMsg } = this.state

    return (
      <div>
        <header id={"code-header"}>
          <h1>Code assignment</h1>
          <h3>{assignment.title}</h3>
        </header>
        <div id={"description"}>
          {description.map((description, i) => {
            return <AssignmentDescription description={description} key={i}/>
          })}   
        </div>
        <AceEditor name="editor"
          mode="javascript"
          theme="monokai"
          value={challengeSeed.join("\n")}
          height={250}
          ref={instance => { this.ace = instance; }}
          $blockScrolling={1}
        />
        <p className={"msg"} dangerouslySetInnerHTML={{ __html: errorMsg }}></p>
        <p className={"msg"}>{passed ? "All tests passed!": ""}</p>
        <div className={"submit-btns"}>
          <input className={"btn"} style={passed ? {"display": "none"} : {} } type="button" defaultValue="Check Code" onClick={this.onCheck} />
          <input className={"btn reset"} style={passed ? {"display": "none"} : {} } type="button" defaultValue="Reset Solution" onClick={this.onReset} />
          <input className={"btn"} style={!passed ? {"display": "none"} : {} } type="button" defaultValue="Submit Solution" />
        </div>
      </div>
    )
  }
}

export default App;


