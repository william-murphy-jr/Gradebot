jQuery.noConflict()
window.assert = chai.assert
var $ = jQuery

window.addEventListener('message', function(e) {
  if (e.data.challenge) {
    var result = runTest(e.data.text, e.data.challenge)
    window.postMessage({result:result},'*')
  }
}, false)
window.postMessage({loaded:true},'*')


function runTest(text, challenge) {
  var debugErrors = false /* only if webkit inspector open, maybe */
  var tests = []
  // $('body').html(text)
  window.$ = function(sel) {
    document.body.innerHTML = text 

    // var testDiv = document.createElement('body')
    // testDiv.innerHTML = text

    return jQuery(sel, document)
  }
  window.code = text
  window.eval('$("button").addClass("hello")')

  if (! challenge.tests || challenge.tests.length == 0) {
    return { error: 'no tests defined' }
  }

  for (var i=0; i<challenge.tests.length; i++) {
    if ( debugErrors ) {
      eval(challenge.tests[i])
    }
    try {
      var truthy = eval(challenge.tests[i])
      // free code camp test cases are supposed to raise an exception
      tests.push(true)
    } catch(e) {
      tests.push(false)
    }
  }
  return {tests}
}
