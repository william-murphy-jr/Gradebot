import './GradeBot.css';

import ChallengeDescription from './components/ChallengeDescription/ChallengeDescription'
import TestSuite from './components/TestSuite/TestSuite'
import AceEditor from 'react-ace'
import React, { Component } from 'react'
import axios from 'axios'

import 'brace/mode/javascript'
import 'brace/theme/monokai'

const testCode = (data) => { 
  return axios.post('/check-answer', data);
}

const getChallenge = () => {
  return axios.get('/get-state')
}

export default class GradeBot extends Component {

  state = {
    assignment: {},
    description: [],
    challengeSeed: [],
    instructions: [],
    tests: [],
    passing:[],
    passed: false
  }

  //ONLY FOR TESTING TAKE OUT!!!!
  // componentWillMount() {
  //   getChallenge()
  //   .then(res => {
  //     this.setState({
  //       assignment: res.data
  //     })
  //   })
  // this.makeTests()
    // this.instructions = this.state.description.splice(this.state.assignment.description.indexOf("<hr>") + 1)
  // }
  ////////////////////////////////

  makeTests() {
    let code = this._editor ? this._editor.getValue() : this.state.challengeSeed.join("\n")
    let data = { 
      code,
      head: this.state.assignment.head && this.state.assignment.head.join('\n'),
      tail: this.state.assignment.tail && this.state.assignment.tail.join('\n'),
      tests: this.state.assignment.tests
    }

    testCode(data)
      .then(res => this.setState({ 
        passing: res.data,
        challengeSeed:[code]
      }))
  }

  async componentDidMount() {
    this._editor = this.ace.editor
    // this._editor.createWorker()
    this.challengeSeed = this.state.assignment.challengeSeed

    await getChallenge()
      .then(res => {
        const description = res.data.description
        const instructions = description.splice(res.data.description.indexOf("<hr>") + 1)
        this.setState({
          assignment: res.data,
          challengeSeed: res.data.challengeSeed,
          description,
          instructions,
          tests: res.data.tests
        })
      })
    this.makeTests()
  }

  onReset = () => {
    this.setState(prevState => ({
      challengeSeed: this.challengeSeed
    }));
  }

  render() {
    console.log(this.state)
    const { assignment, description, challengeSeed, passed, tests } = this.state
    // passed will check if the assignment tests are the same lenght as the passing array and if they are check to see if 
    // any of them are false. If not of them are it will return true.
    // let passed = assignment.tests.length === this.state.passing.length && !this.state.passing.includes(false)

    return (
      <div>
        <header id="GradeBot-header">
          <h3>{assignment.title}</h3>
          <hr/>
        </header>
        <div className={"challenge-description"}>
          {description.map((description, index) => {
            return <ChallengeDescription description={description} key={index} index={index}/>
          })}   
        </div>
        <div className="challenge-instructions-tests">
          <div className="challenge-instuctions">
            <h3>Instructions</h3>
            {this.state.instructions.map((line, index) => <p key={index} dangerouslySetInnerHTML={{ __html: line }}></p>)}
          </div>
          <div className="challenge-tests">
            <h3>Tests</h3>
            <TestSuite passing={this.state.passing}tests={tests}/>
          </div>
        </div>
        <hr />
        <AceEditor 
          name="editor"
          className="bigitem"
          mode="javascript"
          theme="monokai"
          value={challengeSeed.join("\n")}
          ref={instance => { this.ace = instance; }}
          editorProps={{$blockScrolling: true}}
        />
          <p className={"msg"}>{passed ? "All tests passed!": ""}</p>
        <div className={"submit-btns"}>
        { !passed ? 
            [<input key={"btn1"}className={"btn"} type="button" defaultValue="Check Code" onClick={this.makeTests.bind(this)} />,
            <input key={"btn2"}className={"btn reset"} type="button" defaultValue="Reset Solution" onClick={this.onReset} />]
          : 
            <input className={"btn"} type="button" defaultValue="Submit Solution" />  
        }
        </div>
      </div>
    )
  }
}



