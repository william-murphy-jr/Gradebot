import './App.css';

import ChallengeDescription from './components/ChallengeDescription/ChallengeDescription'
import TestSuite from './components/TestSuite/TestSuite'
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios'


import 'brace/mode/javascript';
import 'brace/theme/monokai';

const testCode = (data) => { 
  return axios.post('/check-answer', data);
}

export default class App extends Component {

  state = {
    assignment:  {
      "id": "56533eb9ac21ba0edf2244a8",
      "title": "Storing Values with the Assignment Operator",
      "description": [
        "In JavaScript, you can store a value in a variable with the <dfn>assignment</dfn> operator.",
        "<code>myVariable = 5;</code>",
        "This assigns the <code>Number</code> value <code>5</code> to <code>myVariable</code>.",
        "Assignment always goes from right to left. Everything to the right of the <code>=</code> operator is resolved before the value is assigned to the variable to the left of the operator.",
        "<blockquote>myVar = 5;<br>myNum = myVar;</blockquote>",
        "This assigns <code>5</code> to <code>myVar</code> and then resolves <code>myVar</code> to <code>5</code>  again and assigns it to <code>myNum</code>.",
        "<hr>",
        "Assign the value <code>7</code> to variable <code>a</code>.",
        "Assign the contents of <code>a</code> to variable <code>b</code>."
      ],
      "releasedOn": "January 1, 2016",
      "head": [
        "if (typeof a != 'undefined') {",
        "  a = undefined;",
        "}",
        "if (typeof b != 'undefined') {",
        "  b = undefined;",
        "}"
      ],
      "challengeSeed": [
        "// Setup",
        "var a;",
        "var b = 2;",
        "",
        "// Only change code below this line",
        ""
      ],
      "tail": [
        "(function(a,b){return \"a = \" + a + \", b = \" + b;})(a,b);"
      ],
      "solutions": [
        "var a;\nvar b = 2;\na = 7;\nb = a;"
      ],
      "tests": [
        "assert(/var a;/.test(code) && /var b = 2;/.test(code), 'message: Do not change code above the line');",
        "assert(typeof a === 'number' && a === 7, 'message: <code>a</code> should have a value of 7');",
        "assert(typeof b === 'number' && b === 7, 'message: <code>b</code> should have a value of 7');",
        "assert(/b\\s*=\\s*a\\s*;/g.test(code), 'message: <code>a</code> should be assigned to <code>b</code> with <code>=</code>');"
      ],
    },
    description: [
      "In JavaScript, you can store a value in a variable with the <dfn>assignment</dfn> operator.",
      "<code>myVariable = 5;</code>",
      "This assigns the <code>Number</code> value <code>5</code> to <code>myVariable</code>.",
      "Assignment always goes from right to left. Everything to the right of the <code>=</code> operator is resolved before the value is assigned to the variable to the left of the operator.",
      "<blockquote>myVar = 5;<br>myNum = myVar;</blockquote>",
      "This assigns <code>5</code> to <code>myVar</code> and then resolves <code>myVar</code> to <code>5</code>  again and assigns it to <code>myNum</code>.",
      "<hr>",
      "Assign the value <code>7</code> to variable <code>a</code>.",
      "Assign the contents of <code>a</code> to variable <code>b</code>."
    ],
    challengeSeed:[
      "// Setup",
      "var a;",
      "var b = 2;",
      "",
      "// Only change code below this line",
      ""
    ],
    passing:[],
    passed: false
  }

  //ONLY FOR TESTING TAKE OUT!!!!
  componentWillMount() {
    this.instructions = this.state.description.splice(this.state.assignment.description.indexOf("<hr>") + 1)
  }
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

  componentDidMount() {
    this._editor = this.ace.editor
    this.challengeSeed = this.state.assignment.challengeSeed
    this.makeTests()
  }

  onReset = () => {
    this.setState(prevState => ({
      challengeSeed: this.challengeSeed
    }));
  }

  render() {
    const { assignment, description, challengeSeed, } = this.state
    // passed will check if the assignment tests are the same lenght as the passing array and if they are check to see if 
    // any of them are false. If not of them are it will return true.
    let passed = assignment.tests.length === this.state.passing.length && !this.state.passing.includes(false)

    return (
      <div>
        <header id="App-header">
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
            {this.instructions.map((line, index) => <p key={index} dangerouslySetInnerHTML={{ __html: line }}></p>)}
          </div>
          <div className="challenge-tests">
            <h3>Tests</h3>
            <TestSuite passing={this.state.passing}tests={assignment.tests}/>
          </div>
        </div>
        <hr />
        <AceEditor name="editor"
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



