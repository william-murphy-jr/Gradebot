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
    challengeSeed: []
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
      description: prevState.description
    }));
  }

  onSubmit = () => {
    const code = this.ace.editor.getValue()
    this.state.assignment.tests.forEach((test) => {
      eval(test)
    })

    return console.log('i never get here if theres an error')

  }

  render() {
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
        {/* <p className={"msg"} dangerouslySetInnerHTML={{__html:msg}}></p> */}
        <AceEditor name="editor"
          mode="javascript"
          theme="monokai"
          value={this.state.challengeSeed.join("\n")}
          height={250}
          blockScrolling="Infinity"
          ref={instance => { this.ace = instance; }}
        />
        <div className={"submit-btns"}>
          <input className={"btn"} type="button" defaultValue="Check Code"  onClick={this.onSubmit}/>
          <input className={"btn reset"} type="button" defaultValue="Reset Solution" onClick={this.onReset}/>
        </div>
        {/* <pre style={{display:'none'}}>
          {JSON.stringify(this.state,null,2)}
        </pre> */}
      </div>
    )
  }
}

export default App;


