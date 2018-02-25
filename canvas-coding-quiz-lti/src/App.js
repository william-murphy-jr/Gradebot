import './App.css';

import ChallengeDescription from './components/ChallengeDescription/ChallengeDescription'
import TestSuite from './components/TestSuite/TestSuite'
import React, { Component } from 'react';
import { assert } from 'chai';
import AceEditor from 'react-ace';
import axios from 'axios'
window.assert = assert

import 'brace/mode/javascript';
import 'brace/theme/monokai';

class App extends Component {

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
    passed: false
  }

  //ONLY FOR TESTING TAKE OUT!!!!
  componentWillMount() {
    this.instructions = this.state.description.splice(this.state.assignment.description.indexOf("<hr>") + 1)
  }
  ////////////////////////////////

  componentDidMount() {
    this._editor = this.ace.editor
    this._editor.$blockScrolling = Infinity;
    axios.get('/lti')
      .then(res => {
        const assignment = res.data.assignment
        this.challengeSeed = res.data.initstate.assignment.challengeSeed
        this.setState({
          assignment,
          description: assignment.description,
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
    var code = this._editor.getValue()
    let passed = true
    let head = this.state.assignment.head ? this.state.assignment.head.join('\n') : ""
    let tail = this.state.assignment.tail ? this.state.assignment.tail.join('\n') : ""
    this.state.assignment.tests.forEach((test) => {
      try {
        let codeAndTest = `${head} \n ${code} \n ${tail} \n ${test} `
        eval(codeAndTest)
      } catch(e) {
        passed = false
      }
    })
    this.setState({
      passed,
      challengeSeed:[code]
    })
  }

  runTest = (test) => {
    if (!this._editor) return
    var code = this._editor.getValue()
    let passed = true
    let head = this.state.assignment.head ? this.state.assignment.head.join('\n') : ""
    let tail = this.state.assignment.tail ? this.state.assignment.tail.join('\n') : ""
    try {
      let codeAndTest = `${head} \n ${code} \n ${tail} \n ${test} `
      eval(codeAndTest)
    } catch(e) {
      console.log(e)
      passed = false
    }
    return passed
  }

  render() {
    const { passed, assignment, description, challengeSeed, errorMsg, instructions } = this.state
    // const tests = this.state.assignment.tests.map( t => t.split("'message:"))
    const t = this.state.assignment.description.splice(description.indexOf("<hr>") + 1)
    return (
      <div>
        <header id="App-header">
          <h4>{assignment.title}</h4>
          <hr/>
        </header>
        <div className={"challenge-description"}>
          {this.state.description.map((description, index) => {
            return <ChallengeDescription description={description} index={index}/>
          })}   
        </div>
        <div className="challenge-instructions-tests">
          <div className="challenge-instuctions">
            <h3>Instructions</h3>
            {this.instructions.map((line, index) => <p key={index} dangerouslySetInnerHTML={{ __html: line }}></p>)}
          </div>
          <div className="challenge-tests">
            <h3>Tests</h3>
            <TestSuite tests={assignment.tests} runTest={this.runTest}/>
          </div>
        </div>
        <hr />
        <AceEditor name="editor"
          className="bigitem"
          mode="javascript"
          theme="monokai"
          value={challengeSeed.join("\n")}
          height={250}
          ref={instance => { this.ace = instance; }}
          asi={false}
        />
          {/* <p className={"msg"} dangerouslySetInnerHTML={{ __html: errorMsg }}></p> */}
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


