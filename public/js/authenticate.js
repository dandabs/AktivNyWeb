axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: 'http://localhost:3000',
  json: true
  })

function autoSignIn() {



}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function signIn() {

  firebase.auth()
  .signInWithEmailAndPassword("dummy@gmail.com", "pass123!")
  .then((user) => {

    console.log(user);
    document.getElementById('auth').innerHTML = 'Authorized'

    firebase.auth().currentUser.getIdToken().then(idToken => {
      // Session login endpoint is queried and the session cookie is set.
      // CSRF protection should be taken into account.
      const csrfToken = getCookie('csrfToken')

      client({
        method: 'post',
        url: '/sessionLogin',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'idToken': idToken,
          'csrfToken': csrfToken,
          "Access-Control-Allow-Origin": "*"
        }
      })

    });

  }).catch((err) => {

    document.getElementById('auth').innerHTML = err

  })
}

function signOut() {
  firebase.auth().signOut().then(() => {
    window.location.reload();
    return false;
  }).catch((err) => {
    alert(err);
  })
}

    function sendRequest () {

  if (firebase.auth().currentUser) {
    firebase.auth().currentUser.getIdToken(true)
    .then((idToken) => {
      console.log(idToken);
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
