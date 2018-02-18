import './App.css';

import React, { Component } from 'react';

import axios from 'axios'

class App extends Component {

  state = {
    assignment: []
  }

  componentDidMount() {
    axios.get('/lti')
      .then(res => {
        const assignment = res.data.initstate.assignment;
        this.setState({ assignment });
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
          {this.state.assignment.description && this.state.assignment.description.map((description, i) => {
            return <p key={i} dangerouslySetInnerHTML={{__html:description}}></p>
          })}
        </div>
        {/* <pre id="editor">
        </pre> */}
        {/* <p className={"msg"} dangerouslySetInnerHTML={{__html:msg}}></p> */}
        <br />
        <div className={"submit-btns"} >
          <button>hit</button>
        </div>
        {/* <pre style={{display:'none'}}>
          {JSON.stringify(this.state,null,2)}
        </pre> */}
      </div>
    )
  }
}

export default App;


