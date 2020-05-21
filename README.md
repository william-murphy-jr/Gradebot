### Canvas LMS "gradebot" thing

This repository contains an "LTI" integration with canvas that lets a
student take an quiz / assignment with a fizbuzz coding / programming
problem. The grade is stored as a normal assignment's grade inside
canvas.

### Setting up Environment Variables

- Create a .env file
- Add these variables to your .env file
  - CANVAS_API_TOKEN = <\Your Canvas API Token >"
  - CANVAS_BASE = https://thelastmile.instructure.com/
  - LTI_ROOT = http://127.0.0.1:3030
  - CONSUMER_KEY = gradebot
  - CONSUMER_SECRET = consumersecret

Install instructions: to come

### Credits:
- LTI integration: https://github.com/omsmith/ims-lti
- Example coding challenges: https://github.com/freecodecamp/freecodecamp

### Issues

On fresh npm installs the node server will sometimes throw the following error when receiving test data from the frontend.

```bash
JavaScript TypeError: require(...).jsdom is not a function
```

 To fix this reinstall the `node-jquery` and then `jquery` node modules. You may have to do this several times. The most probable cause of this is the animate.css library which seems to install a jquery library that is incompatible with the jsdom module as we implement it. The `animate.css` library that should be used for this project is the old v3.7. It should be noted that the newer `animate.css` library v4.0+ uses new class names that are not compatible with the test that the Canvas LMS carries out and it's use will **not** stop the jsdom node server issues.