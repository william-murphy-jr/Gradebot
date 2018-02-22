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
    assignment:  {
      "id": "56533eb9ac21ba0edf2244d8",
      "title": "Comparisons with the Logical And Operator",
      "description": [
        "Sometimes you will need to test more than one thing at a time. The <dfn>logical and</dfn> operator (<code>&&</code>) returns <code>true</code> if and only if the <dfn>operands</dfn> to the left and right of it are true.",
        "The same effect could be achieved by nesting an if statement inside another if:",
        "<blockquote>if (num > 5) {<br>  if (num < 10) {<br>    return \"Yes\";<br>  }<br>}<br>return \"No\";</blockquote>",
        "will only return \"Yes\" if <code>num</code> is greater than <code>5</code> and less than <code>10</code>. The same logic can be written as:",
        "<blockquote>if (num > 5 && num < 10) {<br>  return \"Yes\";<br>}<br>return \"No\";</blockquote>",
        "<hr>",
        "Combine the two if statements into one statement which will return <code>\"Yes\"</code> if <code>val</code> is less than or equal to <code>50</code> and greater than or equal to <code>25</code>. Otherwise, will return <code>\"No\"</code>."
      ],
      "releasedOn": "January 1, 2016",
      "challengeSeed": [
        "function testLogicalAnd(val) {",
        "  // Only change code below this line",
        "",
        "  if (val) {",
        "    if (val) {",
        "      return \"Yes\";",
        "    }",
        "  }",
        "",
        "  // Only change code above this line",
        "  return \"No\";",
        "}",
        "",
        "// Change this value to test",
        "testLogicalAnd(10);"
      ],
      "solutions": [
        "function testLogicalAnd(val) {\n  if (val >= 25 && val <= 50) {\n    return \"Yes\";\n  }\n  return \"No\";\n}"
      ],
      "tests": [
        "assert(code.match(/&&/g).length === 1, 'message: You should use the <code>&&</code> operator once');",
        "assert(code.match(/if/g).length === 1, 'message: You should only have one <code>if</code> statement');",
        "assert(testLogicalAnd(0) === \"No\", 'message: <code>testLogicalAnd(0)</code> should return \"No\"');",
        "assert(testLogicalAnd(24) === \"No\", 'message: <code>testLogicalAnd(24)</code> should return \"No\"');",
        "assert(testLogicalAnd(25) === \"Yes\", 'message: <code>testLogicalAnd(25)</code> should return \"Yes\"');",
        "assert(testLogicalAnd(30) === \"Yes\", 'message: <code>testLogicalAnd(30)</code> should return \"Yes\"');",
        "assert(testLogicalAnd(50) === \"Yes\", 'message: <code>testLogicalAnd(50)</code> should return \"Yes\"');",
        "assert(testLogicalAnd(51) === \"No\", 'message: <code>testLogicalAnd(51)</code> should return \"No\"');",
        "assert(testLogicalAnd(75) === \"No\", 'message: <code>testLogicalAnd(75)</code> should return \"No\"');",
        "assert(testLogicalAnd(80) === \"No\", 'message: <code>testLogicalAnd(80)</code> should return \"No\"');"
      ],
      "type": "waypoint",
      "challengeType": 1,
      "translations": {
        "es": {
          "title": "La comparación con el operador lógico y",
          "description": [
            "A veces necesitarás probar más de una cosa a la vez. El operador <dfn>lógico y</dfn> (<code>&&</code>) retorna <code>true</code>(verdadero) si y solo si los <dfn>operandos</dfn> a la izquierda y derecha de este son verdaderos.",
            "El mismo efecto podría lograrse anidando una sentencia if dentro de otro if:",
            "<blockquote>if (num > 5) {<br>  if (num < 10) {<br>    return \"Yes\";<br>  }<br>}<br>return \"No\";</blockquote>",
            "solo retornará \"Yes\" si <code>num</code> está entre <code>6</code> y <code>9</code> (6 y 9 incluidos). La misma lógica puede ser escrita como:",
            "<blockquote>if (num > 5 && num < 10) {<br>  return \"Yes\";<br>}<br>return \"No\";</blockquote>",
            "<h4>Instrucciones</h4>",
            "Combina las dos sentencias if dentro de una sentencia la cual retornará <code>\"Yes\"</code> si <code>val</code> es menor o igual a <code>50</code> y mayor o igual a <code>25</code>. De otra manera, retornará <code>\"No\"</code>."
          ]
        }
      }
    },
      
    description: [
      "Sometimes you will need to test more than one thing at a time. The <dfn>logical and</dfn> operator (<code>&&</code>) returns <code>true</code> if and only if the <dfn>operands</dfn> to the left and right of it are true.",
      "The same effect could be achieved by nesting an if statement inside another if:",
      "<blockquote>if (num > 5) {<br>  if (num < 10) {<br>    return \"Yes\";<br>  }<br>}<br>return \"No\";</blockquote>",
      "will only return \"Yes\" if <code>num</code> is greater than <code>5</code> and less than <code>10</code>. The same logic can be written as:",
      "<blockquote>if (num > 5 && num < 10) {<br>  return \"Yes\";<br>}<br>return \"No\";</blockquote>",
      "<hr>",
      "Combine the two if statements into one statement which will return <code>\"Yes\"</code> if <code>val</code> is less than or equal to <code>50</code> and greater than or equal to <code>25</code>. Otherwise, will return <code>\"No\"</code>."
    ],
    challengeSeed: [
      "function testLogicalAnd(val) {",
      "  // Only change code below this line",
      "",
      "  if (val) {",
      "    if (val) {",
      "      return \"Yes\";",
      "    }",
      "  }",
      "",
      "  // Only change code above this line",
      "  return \"No\";",
      "}",
      "",
      "// Change this value to test",
      "testLogicalAnd(10);"
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


