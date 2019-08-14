import './GradeBot.css';

import ChallengeDescription from './components/ChallengeDescription/ChallengeDescription'
import TestSuite from './components/TestSuite/TestSuite'
import Completed from './components/Completed/Completed'
import AceEditor from 'react-ace'
import React, { Component } from 'react'
import httpClient from './httpClient.js'
import iPhone from './iphone.png'

import 'brace/mode/javascript'
import 'brace/mode/html'
import 'brace/theme/monokai'


export default class GradeBot extends Component {

  state = {
    assignment: {},
    description: [],
    challengeSeed: [],
    instructions: [],
    tests: [],
    passing:[],
    syntax: 'javascript',
    completed: false
  }

  submit_solution = async () =>{
    const body = {
      code: eval(this._editor.getValue()),
      assignment: this.state.assignment
    }
    httpClient.grade(body)
    this.setState({
      completed: true
    })
  }


addJquery = () => {
  var iFrameHead = document.getElementById('iframe').contentWindow.document.head
  var jQuery = document.createElement('script');
  jQuery.type = 'text/javascript';
  jQuery.src = "https://code.jquery.com/jquery-3.4.1.min.js";  
  iFrameHead.appendChild(jQuery);  
}

async injectJS(code) {
  var iFrameHead = document.getElementById('iframe').contentWindow.document.head    
  var myscript = document.createElement('script');
  myscript.innerHTML = code
  await iFrameHead.appendChild(myscript);
  return document.getElementById('iframe').contentWindow.document
}


  makeTests = async () => {
    const assignmentId = this.state.assignment.id
    const iFrameDoc = document.getElementById('iframe').contentWindow.document
    let code = this._editor ? this._editor.getValue() : this.state.challengeSeed.join("\n")
    iFrameDoc.body.innerHTML = code
    const script= code.substring((code.indexOf('<script>') + 8),(code.indexOf('</script>')))
    const scriptedCode = await this.injectJS(script)
    // code = scriptedCode.body.innerHTML
    setTimeout(() => {
      const data = { 
        code,
        head: this.state.assignment.head && this.state.assignment.head.join('\n'),
        tail: this.state.assignment.tail && this.state.assignment.tail.join('\n'),
        tests: this.state.assignment.tests,
        syntax: this.state.syntax,
        html: scriptedCode.body.innerHTML
      }
      httpClient.testCode(data, assignmentId)
      .then(res => {
        this.setState({ 
        passing: res.data,
        challengeSeed:[code]
        })})
    }, 100)

    

  }

  async componentDidMount() {
    this._editor = this.ace.editor
    this._editor.session.setOption("indentedSoftWrap", false)
    this.challengeSeed = this.state.assignment.challengeSeed
    
  
    await httpClient.getChallenge()
      .then(res => {
        console.log(res.data)
        const description = res.data.assignment.description
        const instructions = description.splice(res.data.assignment.description.indexOf("<hr>") + 1)
        this.setState({
          assignment: res.data.assignment,
          challengeSeed: res.data.assignment.challengeSeed,
          syntax: res.data.assignment.syntax || 'html',
          description,
          instructions,
          tests: res.data.assignment.tests,
        })
      })
    this.makeTests()
    this.addJquery()
  }

  onReset = () => {
    this.setState(prevState => ({
      challengeSeed: this.challengeSeed
    }));
  }

  render() {
    const { assignment, 
            description, 
            challengeSeed, 
            tests,
            completed } = this.state
    let passed = tests.length === this.state.passing.length && !this.state.passing.includes(false)
    return (
      <div>
        {completed ? < Completed title={assignment.title}/> :
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
          <div class="editor-div">
            <div>
              <AceEditor 
                name="editor"
                mode={this.state.syntax}
                theme="monokai"
                value={challengeSeed.join("\n")}
                ref={instance => { this.ace = instance; }}
                wrapEnabled={true}
                indentedSoftWrap={false}
                editorProps={{$blockScrolling: true}}
              />
              <div className={"submit-btns"}>
                { !passed ? 
                    [<input key={"btn1"}className={"btn"} type="button" defaultValue="Check Code" onClick={this.makeTests} />,
                    <input key={"btn2"}className={"btn reset"} type="button" defaultValue="Reset Solution" onClick={this.onReset} />]
                  : 
                    <input className={"btn"} type="button" defaultValue="Submit Solution" onClick={this.submit_solution}/>  
                }
              </div>
            </div>
            <div class="iphone" style={{display: this.state.syntax !== "html" ? 'none' : 'flex'}}>
              <div>
                <img src={iPhone} />  
                <iframe id="iframe"></iframe>         
              </div>
            </div>
            
          </div>

        </div>
        }
      </div>
    )
    
  }
  
}



