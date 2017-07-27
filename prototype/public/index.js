async function sample_test() {
  const API_ENDPOINT = '/api/grade'

  // sample function. it checks user code (user_code) against a set of tests (test_user_code)
  
  function user_code(input) {
    // write a function to return the input's length (if it's a string or an array)
    // aka user completed function
    return input.length
  }
  function test_user_code() {
    helperFunction() // helper functions etc may be defined in gradebot.html/gradebot.js
    return user_code([]) === 0 &&
      user_code([1]) === 1 &&
      user_code([1,1]) === 2 &&
      user_code('') === 0 &&
      user_code(' ') === 1
  }
  const body = {
    code:user_code.toString(),
    tests:'('+test_user_code.toString()+')();',
    debugLevel:0
  }
  const opts = {
    method:'post',
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body)
  }
  const result = await fetch(API_ENDPOINT, opts)
  const j = await result.json()
  console.log('api result',result,j)
}

