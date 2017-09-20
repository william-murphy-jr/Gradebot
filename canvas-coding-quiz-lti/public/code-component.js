function runTestIframe(text, challenge) {
  return new Promise( res => {
    var iframe = document.createElement('iframe')
    iframe.src = 'iframe-grader/testframe.html'
    iframe.style.display='none'
    document.querySelector('.test-iframe').innerHTML = ''
    document.querySelector('.test-iframe').appendChild(iframe)
    iframe.contentWindow.addEventListener('message', function(e) {
      if (e.data.loaded) {
        iframe.contentWindow.postMessage({command:'runTest',text:text,challenge:challenge},'*')
      } else {
        if (e.data.command) { return }
        console.log('iframe returns message',e.data)
        res(e.data)
      }
    }, false)
  })
}


async function submit_code(user_code, assignment) {
  // client side only checking, in a web worker
  var result = await runTestIframe(user_code, assignment)
  console.log('submit code final result',result)
  return result
}

async function submit_solution(user_code, state, assignment) {
  /* submit user's code solution to be graded */
  const API_ENDPOINT = '/lti-grade'
  const body = {
    code: user_code,
    state: state,
    assignment: assignment,
    session: sessid
  }
  const opts = {
    method:'post',
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body)
  }
  const result = await fetch(API_ENDPOINT, opts)
  const j = await result.json()
  console.log('submit solution result',result,j)
  return j
}

async function submit_code_server(user_code, test_user_code) {
  // cheat-free version (not working yet)
  const API_ENDPOINT = '/api/grade'
  const body = {
    code:user_code,
    tests:test_user_code,
    debugLevel:0
  }
  const opts = {
    method:'post',
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body)
  }
  const result = await fetch(API_ENDPOINT, opts)
  const j = await result.json()
  console.log('api result',result,j)
  return j
}

class CodeComponent extends React.Component {
  async onSubmit() {
    console.log('submit code to grader')
    var result = await submit_solution(this._editor.getValue(), this.state, assignment)
    if (result.success) {
      this.setState({completed:true})
    }
  }
  async onCheck() {
    console.log('submit/check',this)
    this.setState({submitting:true})
    const user_code = this._editor.getValue()
    const test_user_code = assignment.tests
    const sub_result = await submit_code(user_code, assignment)
    this.setState({submitting:false, submission:sub_result})
  }
  onChange() {
  }
  constructor() {
    super()
  }
  componentDidMount() {
    var t = ''
    for (let line of assignment.challengeSeed) {
       t += line + '\n'
    }
    document.getElementById('editor').textContent = t
    var editor = ace.edit("editor");
    this._editor = editor
    //editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/javascript");
  }
  render() {
    var msg = ''
    var submit = ''
    if (this.state && this.state.completed) {
      return (<div>All done with this assignment!</div>)
    }
    
    if (this.state && this.state.submission && this.state.submission.result) {
      if (this.state.submission.result.message) msg = this.state.submission.result.message
      if (this.state.submission.result.passed) {
        submit = (<input type="button" defaultValue="Submit Solution" onClick={this.onSubmit.bind(this)} />)
        msg = 'Great! Your code passed all tests.'
      }
    }
    
    return  (
        <div>
        <h1>Code assignment</h1>
        <h3>{assignment.title}</h3>
        <div dangerouslySetInnerHTML={{__html:assignment.description}}></div>
        <pre id="editor">
        
      </pre>
        <span dangerouslySetInnerHTML={{__html:msg}}></span>
<br />
        <input type="button" defaultValue="Check Code"
      onClick={this.onCheck.bind(this)}
        />
      { submit }
        <pre style={{display:'none'}}>
        {JSON.stringify(this.state,null,2)}
      </pre>
        </div>);
  }
}


ReactDOM.render(
    <CodeComponent />,
  document.getElementById('root')
);

