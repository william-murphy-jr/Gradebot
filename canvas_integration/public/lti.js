class CodeComponent extends React.Component {
  onCheck() {
    console.log('check it',this)
    // fetch api 
  }
  onChange() {
  }
  constructor() {
    super()
  }
  render() {
    return  (
      <div>
        <h1>Code assignment!</h1>
        <div>{assignment.prompt}</div>
        <pre>
        </pre>
        <textarea value={assignment.template} />
        <input type="button" defaultValue="click"
               onClick={this.onCheck.bind(this)}
               />
      </div>);
  }
}


ReactDOM.render(
  <CodeComponent />,
  document.getElementById('root')
);

