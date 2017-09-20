## Setup

1. Sign into canvas with super user.

2. Navigate to /profile and get an API token. put this in `config.js` (see `config.example.js` for other settings)

3. Under Course settings, click Apps, add Manual/LTI app. Have the URL match the `lti_root` you defined in `config.js`

4. Clone https://github.com/freecodecamp/freecodecamp "seed" directory to use their demo assignments

5. (optional) Use script to import free code camp assignments into your course.


## Manually creating an assignment

Create a new assignment and set grading type to external tool.

Find tools, select the LTI tool you created (step 3 above). add a
query parameter `?assignmentid={ assignment id }`. Adjust the code
that looks for the assignment to read from somewhere you like.

## Notes

- NOTE: must be a student to submit scores (teachers/admins cannot be graded on assignments)
