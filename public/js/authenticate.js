function signIn() {
  firebase.auth()
  .signInWithEmailAndPassword("dummy@gmail.com", "pass123!")
  .then(() => {
    document.getElementById('auth').innerHTML = 'Authorized'
  }).catch((err) => {
    document.getElementById('auth').innerHTML = err
  })
}

function signOut() {
  firebase.auth().signOut().then(() => {
    document.getElementById('auth').innerHTML = 'Unauthorized'
  }).catch((err) => {
    document.getElementById('auth').innerHTML = err
  })
}

    function sendRequest () {

const client = axios.create({
baseURL: 'http://localhost:3000',
json: true
})

  if (firebase.auth().currentUser) {
    firebase.auth().currentUser.getIdToken(true)
    .then((idToken) => {
      client({
        method: 'get',
        url: '/ping',
        headers: {
          'AuthToken': idToken
        }
      }).then((res) => {
        document.getElementById('response').innerHTML = res.data.message
      }).catch((error) => {
        document.getElementById('response').innerHTML = error
      })
    }).catch((error) => {
      document.getElementById('response').innerHTML = "Error getting auth token"
    });
  } else {
    client({
      method: 'get',
      url: '/ping'
    }).then((res) => {
      document.getElementById('response').innerHTML = res.data.message
    }).catch((error) => {
      document.getElementById('response').innerHTML = error
    })
  }

    }