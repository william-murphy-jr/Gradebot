import './GradeBot.css';

import { ButtonContainer, Button } from './style';

import ChallengeDescription from '../components/ChallengeDescription/ChallengeDescription';
import TestSuite from '../components/TestSuite/TestSuite';
import Completed from '../components/Completed/Completed';
import AceEditor from 'react-ace';
import { ClipLoader } from 'react-spinners';

import { css } from '@emotion/core';
import React, { Component } from 'react';
import httpClient from '../httpClient.js';
import iPhone from './iphone.png';

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/theme/monokai';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: white;
`;

export default class GradeBot extends Component {
  state = {
    assignment: {},
    description: [],
    challengeSeed: [],
    instructions: [],
    tests: [],
    passing: [],
    syntax: 'javascript',
    show: false,
    completed: false,
    loading: false,
  };

  runTestIframe(text, challenge) {
    return new Promise(res => {
      var iframe = document.createElement('iframe');
      iframe.src =
        'https://gradebot.tlmworks.org/public/iframe-grader/testframe.html';
      iframe.style.display = 'none';
      document.querySelector('.test-iframe').innerHTML = '';
      document.querySelector('.test-iframe').appendChild(iframe);
      iframe.contentWindow.addEventListener(
        'message',
        function(e) {
          if (e.data.loaded) {
            iframe.contentWindow.postMessage(
              {
                command: 'runTest',
                text: text,
                challenge: challenge,
              },
              '*',
            );
          } else {
            if (e.data.command) {
              return;
            }
            res(e.data);
          }
        },
        false,
      );
    });
  }

  submitSolution = () => {
    const body = {
      code: this._editor.getValue(),
      assignment: this.state.assignment,
    };
    httpClient.grade(body, this.sessionId).then(res => {
      this.setState({
        completed: res.data.message,
      });
    });
  };

  async submit_code(user_code, assignment) {
    // client side only checking, in a web worker
    var result = await this.runTestIframe(user_code, assignment);
    console.log('submit code final result', result);
    return result;
  }

  async injectJS(code) {
    const iFrameHead = document.getElementById('iframe').contentWindow
      .document.head;
    const myScript = document.createElement('script');
    myScript.innerHTML = code;
    await iFrameHead.appendChild(myScript);
    return document.getElementById('iframe').contentWindow.document;
  }

  makeTests = async () => {
    const assignmentId = this.state.assignment.id;
    const iFrameDoc = document.getElementById('iframe').contentWindow
      .document;
    let code = this._editor
      ? this._editor.getValue()
      : this.state.challengeSeed.join('\n');
    iFrameDoc.body.innerHTML = code;
    const script = code.substring(
      code.indexOf('<script>') + 8,
      code.indexOf('</script>'),
    );
    // const scriptedCode = await this.injectJS(script)
    setTimeout(() => {
      const data = {
        code,
        head:
          this.state.assignment.head &&
          this.state.assignment.head.join('\n'),
        tail:
          this.state.assignment.tail &&
          this.state.assignment.tail.join('\n'),
        tests: this.state.assignment.tests,
        syntax: this.state.syntax,
        html: code,
      };
      httpClient.testCode(data, assignmentId).then(res => {
        this.setState({
          passing: res.data,
          challengeSeed: [code],
        });
      });
    }, 100);
  };

  async componentDidMount() {
    this._editor = this.ace.editor;
    this._editor.session.setOption('indentedSoftWrap', false);
    const params = window.location.pathname.split('/');
    this.sessionId = params[2];
    addBootstrap();
    addjQuery();

    await httpClient.getChallenge(this.sessionId).then(res => {
      const description = res.data.assignment.description;
      const instructions = description.splice(
        res.data.assignment.description.indexOf('<hr>') + 1,
      );
      this.setState({
        assignment: res.data.assignment,
        challengeSeed: res.data.assignment.challengeSeed,
        syntax: res.data.assignment.syntax,
        description,
        instructions,
        tests: res.data.assignment.tests,
      });
    });
    this.challengeSeed = this.state.assignment.challengeSeed;
    this.makeTests();
  }

  onReset = () => {
    const iframeDoc = document.getElementById('iframe').contentWindow
      .document;
    this.setState(prevState => ({
      challengeSeed: this.challengeSeed,
    }));
    iframeDoc.body.innerHTML = this.challengeSeed.join('\n');
  };

  hideModal = () => {
    this.setState({ show: false });
    document.body.classList.toggle('stop-scroll');
  };

  onChange(newValue) {
    const iFrameDoc = document.getElementById('iframe').contentWindow
      .document;
    const code = newValue;
    iFrameDoc.body.innerHTML = code;
  }

  render() {
    const {
      assignment,
      description,
      challengeSeed,
      tests,
      completed,
      loading,
    } = this.state;

    return (
      <div>
        <div className='test-iframe'></div>
        <div>
          <div>
            <Completed
              show={this.state.show}
              handleClose={this.hideModal}
              title={assignment.title}
              submitSolution={this.submitSolution}
              completed={completed}
            />
          </div>
          <div className={'challenge-description'}>
            {description.map((description, index) => (
              <ChallengeDescription
                description={description}
                key={index}
                index={index}
              />
            ))}
          </div>
          <div className='challenge-instructions-tests'>
            <div className='challenge-instuctions'>
              <h3>Instructions</h3>
              {this.state.instructions.map((line, index) => (
                <p
                  key={index}
                  dangerouslySetInnerHTML={{ __html: line }}
                ></p>
              ))}
            </div>
            <div className='challenge-tests'>
              <h3>Tests</h3>
              <TestSuite passing={this.state.passing} tests={tests} />
            </div>
          </div>
          <div className='editor-div'>
            <div className='ace-editor-div'>
              <AceEditor
                name='editor'
                mode={this.state.syntax}
                theme='monokai'
                value={challengeSeed.join('\n')}
                ref={instance => {
                  this.ace = instance;
                }}
                wrapEnabled={true}
                indentedSoftWrap={false}
                editorProps={{ $blockScrolling: true }}
                onChange={this.onChange}
              />
              <ButtonContainer>
                <Button
                  color='lightgreen'
                  hoverColor='#1c7269'
                  disabled={loading}
                  isDisabled={loading}
                  onClick={() => this.makeTests()}
                >
                  {loading ? (
                    <ClipLoader css={override} size={20} />
                  ) : (
                    'Run Tests'
                  )}
                </Button>
                <Button
                  color='lightpink'
                  onClick={() => this.onReset}
                  hoverColor='#ce3a51'
                  isDisabled={loading}
                  disabled={loading}
                >
                  Rest Code
                </Button>
              </ButtonContainer>
            </div>
            <div
              class='iphone'
              style={{
                display:
                  this.state.syntax !== 'html' ? 'none' : 'block',
              }}
            >
              <div>
                <img src={iPhone} />
                <iframe id='iframe'></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//Helper Functions

function addBootstrap() {
  const bootstrap = document.createElement('link');
  bootstrap.href =
    'https://static.tlmworks.org/track1/bootstrap/bootstrap3/css/bootstrap.min.css';
  bootstrap.rel = 'stylesheet';
  const head = document.getElementById('iframe').contentWindow
    .document.head;
  head.append(bootstrap);
}

function addjQuery() {
  const jQuery = document.createElement('link');
  jQuery.href = './static/jquery-3.4.1.min.js';
  jQuery.type = 'text/javascript';
  const head = document.getElementById('iframe').contentWindow
    .document.head;
  head.append(jQuery);
}
