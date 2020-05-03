import axios from 'axios';

const httpClient = axios.create();

httpClient.getChallenge = function(
  // sessionId = 'bad87fee1348bd9bedc08826', // 3 test ???
  // sessionId = 'bad87fee1348bd9acdd08826', // add a script & document.ready tag
  // sessionId = 'bad87fee1348bd9aed708826',
  // sessionId = '5a61d23e84acdd9e42575aa3',
  sessionId = 'bad87fee1348bd9aedc08826', // bounce & shake
) {
  return this({ method: 'get', url: `/lti/getstate/${sessionId}` });
};

httpClient.testCode = function(data) {
  return this({ method: 'post', url: `/lti/checkanswer`, data });
};

httpClient.grade = function(body, sessionId) {
  return this({
    method: 'post',
    url: `/lti/grade/${sessionId}`,
    data: body,
  });
};

export default httpClient;
