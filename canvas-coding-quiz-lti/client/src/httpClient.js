import axios from 'axios'
// instantiate axios
const httpClient = axios.create()


// httpClient.getCurrentUser = function() {
// 	const token = this.getToken()
// 	console.log(token)
// 	if(token) return jwtDecode(token)
// 	return null
// }

// const getChallenge = () => {
//   return axios.get('/get-state')
// }

httpClient.getChallenge = function() {
	return this({ method: 'get', url: '/get-state'})
}

httpClient.testCode = function(data) {
  return this({method: 'post', url:'/check-answer', data})
}

export default httpClient
