import './App.css';

import Assignment from './components/Assignment/Assignment'
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios'

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
        this.setState({ assignment, 
          description, 
          challengeSeed });
      })
  }

  render() {
    return (
      <div>
        <header id={"code-header"}>
          <h1>Code assignment</h1>
          <h1>
          </h1>
          <h3>{this.state.assignment.title}</h3>
        </header>
        <div id={"description"}>
          {this.state.description.map((description, i) => {
            return <Assignment description={description} key={i}/>
          })}
          
        </div>
        {/* <pre id="editor">
        </pre> */}
        {/* <p className={"msg"} dangerouslySetInnerHTML={{__html:msg}}></p> */}
        <br />
        <div className={"submit-btns"} >
          <button>hit</button>
        </div>
        <AceEditor name="editor"
          mode="javascript"
          theme="monokai"
          value={this.state.challengeSeed.join("\n")}
          cursorStart={2}
        />
        {/* <pre style={{display:'none'}}>
          {JSON.stringify(this.state,null,2)}
        </pre> */}
      </div>
    )
  }
}

export default App;


