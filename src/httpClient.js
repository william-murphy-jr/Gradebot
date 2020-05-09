import axios from 'axios';

const httpClient = axios.create();

httpClient.getChallenge = function(
  // sessionId = 'bad87fee1348bd9bedc08826', // 2 test empty ready function 1P 1F * (Not seeing jQuery???)
  // sessionId = 'bad87fee1348bd9acdd08826', // 3 Test -- add a script & document.ready tag 3P 0F
  // sessionId = 'bad87fee1348bd9aed708826',    // 2 Test -- remove an element 1P 1F * (Not seeing jQuery???)
  // sessionId = '5a61d23e84acdd9e42575aa3',
  sessionId = 'bad87fee1348bd9aedc08826', // 2 Test  bounce & shake  2P 0F *** DEFAULT TEST *** 
  // sessionId = 'bad87fee1348bd9aecb08826', // 2 Test  Use jQuery to modify the entire page 
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
