async function submit_code(user_code, test_user_code) {
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
    console.log('submit/check',this)
    this.setState({submitting:true})
    const user_code = this._editor.getValue()
    const test_user_code = assignment.tests
    const result = await submit_code(user_code, test_user_code)
    this.setState({submitting:false})
    this.setState({result})
  }
  onChange() {
  }
  constructor() {
    super()
  }
  componentDidMount() {
    document.getElementById('editor').innerText = assignment.template
    var editor = ace.edit("editor");
    this._editor = editor
    //editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/javascript");
  }
  render() {
    return  (
      <div>
        <h1>Code assignment!</h1>
        <div>{assignment.prompt}</div>
        <pre id="editor">

        </pre>

        <input type="button" defaultValue="Submit"
               onClick={this.onSubmit.bind(this)}
        />
        <pre>
        {JSON.stringify(this.state,null,2)}
        </pre>
      </div>);
  }
}


ReactDOM.render(
  <CodeComponent />,
  document.getElementById('root')
);

