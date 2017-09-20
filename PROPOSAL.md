# Project Proposal: Chrome headless based robot grader API / Web app / Canvas Quiz App

Running a grader robot for a coding exercise can be a challenge because the grader robot is executing untrusted code. A student could destroy the grader robot machine by executing scripts to remove files on the system, for example.

The environment running the untrusted code must be isolated from the operating system. There are several ways to do this

- Method 1: Run the untrusted code in a virtual machine. This method is rather heavyweight. To ensure the grader robot is stateless, the machine must boot and run and then be reset with each grading run. This would cause some major delays.

- Method 2: Run the untrusted code in a docker container. This is a reasonable method, and provides some fairly good isolation. It is not completely foolproof however. A dedicated attacker could likely escape the docker container and obtain access to the host.

- Method 3: Run headless chrome instance. This method lets you use chrome’s process isolation model and get access to a V8 runtime without OS access. However it can’t run node.js filesystem type codes. And it means our grader only does JS.

Method 3 seems pretty great in my opinion! We only officially teach JS anyway. It’s quite flexible and can be also used for exercises that exercise the DOM or browser JS apis such as XHR as well

Basic sketch

`npm install chrome-remote-interface`

Write a small (say express app) api:

`/api/grade?code=(user’s code)&tests=(unit tests code)&debuglevel=1`

This will cause the backend to load up a headless chrome if it’s not already running

`chrome --headless --remote-debugging-port=9222`

and then use the remote debugger protocol API something like:

```js
const CDP = require('chrome-remote-interface');

async function example() {
    try {
        // connect to endpoint
        var client = await CDP();
        // extract domains
        const {Network, Page} = client;
        // setup handlers
        Network.requestWillBeSent((params) => {
            console.log(params.request.url);
        });
        // enable events then start!
        // TODO use Page.createIsolatedWorld
        await Promise.all([Network.enable(), Page.enable()]);
        await Page.navigate({url: 'https://gradebot.tlmworks.org?code=xxx&tests=yyy'});
        await Page.loadEventFired();
        //         // https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#method-evaluate
        // set up timing and do Runtime.evaluate
        // extract out the result and pipe back to API
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

example();
```

The unit test code is not normally supplied by the user, but by the app using the api. An example user code snippet (template)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    
};
```

The test code would have some common boilerplate to check for existence of the function, and then it would run a lot of sample inputs and outputs, and return either pass/fail or more information depending on debuglevel parameter.

## Step 2: webapp

Make a basic webapp with challenge question prompt(s) and bundled test cases (hidden from user)

We could then use this API to write a simple frontend app.

## Step 3: canvas integration

Have a canvas quiz/test iframe and handle submit button to communicate back to canvas whether the solution was accepted.

There are likely several ways to do this. Here is an example implementation

Authorization: Have the canvas administrator account do a one-time oauth grant or get an access token so that you can use the canvas API.

Here’s a nice tutorial/overview of how to get started:
https://www.edu-apps.org/code.html
