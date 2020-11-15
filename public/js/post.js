function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function postPost(uid) {

    firebase.firestore()
    .collection('posts').doc(uuidv4()).set(
        {
            author: firebase.firestore().doc('users/' + uid),
            body: document.getElementsByClassName('ql-editor')[0].innerHTML,
            timestamp: Math.round(new Date().getTime()/1000),
            title: document.getElementById('title').value
        }
    )

}