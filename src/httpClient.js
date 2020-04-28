import axios from 'axios';

const httpClient = axios.create();

httpClient.getChallenge = (sessionId = '56533eb9ac21ba0edf2244a9') =>
  this({ method: 'get', url: `/lti/getstate/${sessionId}` });

httpClient.testCode = data =>
  this({ method: 'post', url: `/lti/checkanswer`, data });

httpClient.grade = function(body, sessionId) {
  return this({
    method: 'post',
    url: `/lti/grade/${sessionId}`,
    data: body,
  });
};

export default httpClient;
