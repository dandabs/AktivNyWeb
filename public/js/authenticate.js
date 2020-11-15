axios.defaults.withCredentials = true;

var client = axios.create({
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

function deleteAllCookies() {

  var name = "session";

    // This function will attempt to remove a cookie from all paths.
    var pathBits = location.pathname.split('/');
    var pathCurrent = ' path=';

    // do a simple pathless delete first.
    document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

    for (var i = 0; i < pathBits.length; i++) {
        pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathBits[i];
        document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
    }
}

function signIn() {

  let username = document.getElementById('exampleInputEmail1').value;
  let password = document.getElementById('exampleInputPassword1').value;

  firebase.auth()
  .signInWithEmailAndPassword(username, password)
  .then((user) => {

    console.log(user);
    //document.getElementById('auth').innerHTML = 'Authorized'

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

      }).then(_ => {

        window.location.reload();

      })

      

    });

  }).catch((err) => {

    //document.getElementById('auth').innerHTML = err

  })
}

function signUp() {

  let username = document.getElementById('exampleInputEmail1').value;
  let password = document.getElementById('exampleInputPassword1').value;

  firebase.auth()
  .createUserWithEmailAndPassword(username, password)
  .then((user) => {

    console.log(user);

    firebase.firestore().collection('users').doc(user.user.uid).set(
      {

        permissions: {
          admin: false,
          editor: false
        },
        profile: {
          biography: "",
          displayname: user.user.email,
          gravatar: true,
          username: user.user.uid,
          social: {
            email: username
          }
        }

      }
    );

    
    //document.getElementById('auth').innerHTML = 'Authorized'

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

      }).then(_ => {

        window.location.reload();

      })

      

    });

  }).catch((error) => {

    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode);
    console.log(errorMessage);

  })
}


function signOut() {
  firebase.auth().signOut().then(() => {
    deleteAllCookies();
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
