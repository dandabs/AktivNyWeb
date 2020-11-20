function populateFields(uid) {

console.log(uid);

firebase.default.firestore().collection('users').doc(uid).get().then(doc => {

    console.log(doc.data());

    $('#displayname').val(doc.data().profile.displayname);
    $('#username').val(doc.data().profile.username);
    $('#biography').val(doc.data().profile.biography);

    $('#twitter').val(doc.data().profile.social.twitter);
    $('#instagram').val(doc.data().profile.social.instagram);
    $('#discord').val(doc.data().profile.social.discord);

    let icon = "";

    if ( doc.data().profile.gravatar) icon = "https://www.gravatar.com/avatar/" + CryptoJS.MD5(doc.data().profile.social.email).toString();
    if (!doc.data().profile.gravatar) icon = doc.data().profile.icon;

    $('#avatar').attr("src", icon);

})

}

function saveInfo(uid) {

    firebase.default.firestore().collection('users').doc(uid).set({ profile: {

        displayname: $('#displayname').val(),
        username: $('#username').val(),
        biography: $('#biography').val()

    }}, { merge: true }).then(_ => {

        location.replace('/');

    });

}

function saveSocials(uid) {

    firebase.default.firestore().collection('users').doc(uid).set({ profile: {

        social: {

            twitter: $('#twitter').val(),
            instagram: $('#instagram').val(),
            discord: $('#discord').val()

        }

    }}, { merge: true }).then(_ => {

        location.replace('/');

    });

}

function saveAvatar(uid) {

    var fileReader = new FileReader();
    fileReader.onload = function () {

      var data = fileReader.result; 

      var storageRef = firebase.storage().ref();
      var ref = storageRef.child('avatars/' + uid + '.png');

      console.log(data);

      ref.putString(data, 'data_url').then(function(snapshot) {
        console.log('Uploaded a base64 string!');
      });

    };

    fileReader.readAsDataURL($('#avatarupload').prop('files')[0]);

    firebase.default.firestore().collection('users').doc(uid).set({ profile: {

        gravatar: false,
        icon: "https://firebasestorage.googleapis.com/v0/b/aktiv-ny.appspot.com/o/avatars%2F"+ uid + ".png?alt=media",

    }}, { merge: true }).then(_ => {

        location.replace('/');

    });

}
