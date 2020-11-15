$(document).ready(getPosts(3))
$(document).ready(getPost())

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function postPost(uid) {

    let id = uuidv4();

    firebase.default.firestore()
    .collection('posts').doc(id).set(
        {
            author: firebase.firestore().doc('users/' + uid),
            body: document.getElementsByClassName('ql-editor')[0].innerHTML,
            timestamp: Math.round(new Date().getTime()/1000),
            title: document.getElementById('title').value
        }
    ).then(_ => {

        window.location.replace('/post/' + id);

    })

}

function getPosts(amount) {

    firebase.default.firestore().collection('posts').orderBy("timestamp", "desc").limit(amount).get().then((snap) => {

        if (snap.size != 0) {

            snap.forEach(doc => {

                console.log(doc.id);

                var outerContainer = $(document.createElement('div'));
                $(outerContainer).css({
                    padding: '5px'
                });
                $(outerContainer).addClass('col-6');

                var innerContainer = $(document.createElement('div'));  
                $(innerContainer).addClass('card');
                $(innerContainer).addClass('card-body');
                $(innerContainer).addClass('bg-light');
                $(innerContainer).addClass('non-rounded');
                $(innerContainer).addClass('non-bordered');
                $(innerContainer).addClass('shadow');
                $(innerContainer).css({
                    padding: '0 !important'
                });

                $(innerContainer).html(`

                <div style="padding: 1.25rem; padding-bottom: 2vh;">
                <h5>${doc.data().title}</h5>
                </div>
                
                <img src="${doc.data().cover}" style="height: 30vh; object-fit: cover; border-radius: 5px;"></img>
                
                <div style="padding: 1.25rem">
                <p>${String(doc.data().sample).substr(0, 100).trim()}...</p>
                
                <a href="/post/${doc.id}">Read more...</a>
                
                </div>

                `);

                $(outerContainer).append(innerContainer)

                //now appending it to main container
                $('#container').append(outerContainer);

            })

        }

    })

}

function getPost() {

if (String(window.location.href).includes("/post/")) {

    let id = window.location.href.split("/post/")[1];

    firebase.default.firestore().collection('posts').doc(id).get().then(doc => {

        let data = doc.data();

        document.getElementById('postTitle').innerHTML = doc.data().title;
        document.getElementById('postBody').innerHTML = doc.data().body;
        console.log(doc.data().cover);
        document.getElementById('image').setAttribute("src", doc.data().cover);

        data.author.get().then(user => {

            let icon = "";

            if ( user.data().profile.gravatar) icon = "https://www.gravatar.com/avatar/" + CryptoJS.MD5(user.data().profile.social.email).toString();
            if (!user.data().profile.gravatar) icon = user.data().profile.icon;

            document.getElementById('authorIcon').setAttribute("src", icon);
            document.getElementById('authorName').innerHTML = user.data().profile.displayname;
            document.getElementById('authorBio').innerHTML = user.data().profile.biography;

        })
        

    })

}

}