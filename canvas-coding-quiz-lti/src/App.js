import './App.css';

import AssignmentDescription from './components/AssignmentDescription/AssignmentDescription'
import React, { Component } from 'react';
import { assert } from 'chai';
import AceEditor from 'react-ace';
import axios from 'axios'
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
    axios.get('/lti')
      .then(res => {
        const assignment = res.data.initstate.assignment;
        const challengeSeed = res.data.initstate.assignment.challengeSeed
        const description = res.data.initstate.assignment.description
        this.setState({ 
          assignment, 
          description, 
          challengeSeed 
        });
      })
  }

  onReset = () => {
    this.setState(prevState => ({
      description: prevState.description,
      errorMsg: ""
    }));
  }

  onCheck = () => {
    let passed = true
    const code = this.ace.editor.getValue()
    let errorMsg;
    this.state.assignment.tests.forEach((test) => {
      try {
        eval(test)
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
    let button = null;
    if (!this.state.passed) {
      button = [<input className={"btn"} type="button" defaultValue="Check Code" onClick={this.onCheck} />,
      <input className={"btn reset"} type="button" defaultValue="Reset Solution" onClick={this.onReset} />]
    } else {
      button = <input className={"btn"} type="button" defaultValue="Submit Solution" />
    }
    return (
      <div>
        <header id={"code-header"}>
          <h1>Code assignment</h1>
          <h3>{this.state.assignment.title}</h3>
        </header>
        <div id={"description"}>
          {this.state.description.map((description, i) => {
            return <AssignmentDescription description={description} key={i}/>
          })}   
        </div>
        <AceEditor name="editor"
          mode="javascript"
          theme="monokai"
          value={this.state.challengeSeed.join("\n")}
          height={250}
          ref={instance => { this.ace = instance; }}
        />
        <p className={"msg"} dangerouslySetInnerHTML={{ __html: this.state.errorMsg }}></p>
        <div className={"submit-btns"}>
          {button}
        </div>
      </div>
    )
  }
}

export default App;


