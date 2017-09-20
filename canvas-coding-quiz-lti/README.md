# setting up

Sign into canvas, under Course settings, click Apps, add Manual app.

Use localtunnel `lt -p 3030` to get a public URL to embed as a canvas
LTI external tool. Make sure consumer key and consumer secret match.

Good docs on the LTI launch params: https://www.edu-apps.org/code.html

---

once configured, create a new assignment and set grading type to external tool.

find tools, select gradebot. add a query parameter ?assignmentid=3


## Notes

- Launch LTI tool with ?assignmentid parameter
- Get assignment info from pre-cloned git repository (private)
- NOTE: outcome URL thing only works for students! not instructor.
- use `provider.outcome_service` to send grade back.