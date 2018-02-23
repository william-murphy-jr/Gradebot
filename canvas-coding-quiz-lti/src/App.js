import './App.css';

import ChallengeInstruction from './components/ChallengeInstruction/ChallengeInstruction'
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
    errorMsg: "",
    passed: false
  }

  componentDidMount() {
    this._editor = this.ace.editor
    this._editor.$blockScrolling = Infinity;
    axios.get('/lti')
      .then(res => {
        this.challengeSeed = res.data.initstate.assignment.challengeSeed
        this.setState({
          assignment: res.data.initstate.assignment,
          description: res.data.initstate.assignment.description,
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
    let errorMsg;
    let head = this.state.assignment.head ? this.state.assignment.head.join('\n') : ""
    let tail = this.state.assignment.tail ? this.state.assignment.tail.join('\n') : ""
    this.state.assignment.tests.forEach((test) => {
      try {
        let codeAndTest = `${head} \n ${code} \n ${tail} \n ${test} `
        eval(codeAndTest)
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
    const tests = this.state.assignment.tests.map( t => t.split("'message:"))
    return (
      <div>
        <header id={"code-header"}>
          <h1>Code assignment</h1>
          <h3>{assignment.title}</h3>
        </header>
        <div className={"challenge-instructions"}>
          {description.map((description, i) => {
            return <ChallengeInstruction description={description} key={i}/>
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
          <div>
          <TestSuite tests={tests}/>
          </div>
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


