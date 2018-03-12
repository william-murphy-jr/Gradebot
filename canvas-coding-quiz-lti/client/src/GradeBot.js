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

  submit_solution = async () =>{
    const body = {
      code: this._editor.getValue(),
      assignment: this.state.assignment
    }
    axios.post('/lti/grade', body)
    /* submit user's code solution to be graded */
    // const API_ENDPOINT = '/lti-grade'
    // const body = {
    //   code: user_code,
    //   state: state,
    //   assignment: assignment,
    //   session: sessid
    // }
    // const opts = {
    //   method:'post',
    //   headers: { "Content-Type": "application/json; charset=utf-8" },
    //   body: JSON.stringify(body)
    // }
    // const result = await fetch(API_ENDPOINT, opts)
    // const j = await result.json()
    // console.log('submit solution result',result,j)
    // return j
  }

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
        const description = res.data.assignment.description
        const instructions = description.splice(res.data.assignment.description.indexOf("<hr>") + 1)
        this.setState({
          assignment: res.data.assignment,
          challengeSeed: res.data.assignment.challengeSeed,
          description,
          instructions,
          tests: res.data.assignment.tests,
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
    const { assignment, description, challengeSeed, tests } = this.state
    // passed will check if the assignment tests are the same lenght as the passing array and if they are check to see if 
    // any of them are false. If not of them are it will return true.
    let passed = tests.length === this.state.passing.length && !this.state.passing.includes(false)

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
        <AceEditor 
          name="editor"
          mode="javascript"
          theme="monokai"
          value={challengeSeed.join("\n")}
          ref={instance => { this.ace = instance; }}
          editorProps={{$blockScrolling: true}}
        />
          {/* <p className={"msg"}>{passed ? "All tests passed!": ""}</p> */}
        <div className={"submit-btns"}>
        { !passed ? 
            [<input key={"btn1"}className={"btn"} type="button" defaultValue="Check Code" onClick={this.makeTests.bind(this)} />,
            <input key={"btn2"}className={"btn reset"} type="button" defaultValue="Reset Solution" onClick={this.onReset} />]
          : 
            <input className={"btn"} type="button" defaultValue="Submit Solution" onClick={this.submit_solution}/>  
        }
        </div>
      </div>
    )
  }
}



