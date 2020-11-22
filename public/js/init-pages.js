function homepage() {

    firebase.default.firestore().collection('config').doc('site').get().then(doc => {

        $('#homepagetitle').text(doc.data().homepagetitle);
        $('#homepagecontent').text(doc.data().homepagecontent);

        console.log(doc.data());

    })

}

homepage();