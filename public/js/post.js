$(document).ready(getPosts(4))
$(document).ready(getPost())
$(document).ready(populateMain())

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function postPost(uid) {

    firebase.analytics().logEvent('post_post');

    let id = uuidv4();

    var fileReader = new FileReader();
    fileReader.onload = function () {

      var data = fileReader.result; 

      var storageRef = firebase.storage().ref();
      var ref = storageRef.child('postimages/' + Math.round(new Date().getTime()/1000) + '.png');

      console.log(data);

      ref.putString(data, 'data_url').then(function(snapshot) {
        console.log('Uploaded a base64 string!');
      });

    };

    fileReader.readAsDataURL($('#exampleFormControlFile1').prop('files')[0]);

    firebase.default.firestore()
    .collection('posts').doc(id).set(
        {
            author: firebase.firestore().doc('users/' + uid),
            body: document.getElementsByClassName('ql-editor')[0].innerHTML,
            timestamp: Math.round(new Date().getTime()/1000),
            title: document.getElementById('title').value,
            //sample: document.getElementById('exampleFormControlTextarea1').value,
            cover: "https://firebasestorage.googleapis.com/v0/b/aktiv-ny.appspot.com/o/postimages%2F"+ Math.round(new Date().getTime()/1000) + ".png?alt=media",
            tags: $('#exampleFormControlSelect2').val()
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

/*                var outerContainer = $(document.createElement('div'));
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

                <div style="padding-bottom: 2vh;">
                <a href="/post/${doc.id}"><h5 style="color: black;text-decoration: inherit;">${doc.data().title}</h5></a>
                </div>
                
                <img src="${doc.data().cover}" style="height: 30vh; object-fit: cover; border-radius: 5px;"></img>
                
                <div style="padding: 1.25rem">
                <p>${String(doc.data().sample).substr(0, 100).trim()}...</p>
                
                <a href="/post/${doc.id}">Read more...</a>
                
                </div>

                `);

                $(outerContainer).append(innerContainer)

                //now appending it to main container
                $('#container').append(outerContainer);*/

                var post = $(document.createElement('div'));

                $(post).html(`
                <div style="border-top-style: solid; border-top-width: thin; border-top-color: #D3D3D3;">

                <a href="/post/${doc.id}"><h5 style="padding-top: 2%; text-transform: uppercase; margin-bottom: 0; color: black;text-decoration: inherit;">

                <strong>${doc.data().title}</strong>

                </h5></a>

<p style="text-transform: uppercase; color: #808080;">${new Date(doc.data().timestamp * 1000).toLocaleString()}</p>

</div>
`);

$('#postbar').append(post);


            })

        }

    })

}

function getPost() {

if (String(window.location.href).includes("/post/")) {

    let id = window.location.href.split("/post/")[1].replace('#', '');

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

function populateMain() {

    firebase.default.firestore().collection('categories').get().then((snap) => {

        if (snap.size != 0) {

            snap.forEach(doc => {

                var div = $(document.createElement('div'));

                $(div).css("padding", "1.5rem");
                $(div).addClass("col-md-4");
                $(div).addClass("col-sm-12");

                $(div).html(`

                <a href="/category/${doc.id}"><div class="row card card-body bg-light non-rounded non-bordered shadow"
                style="padding-top: 75%; background-image: linear-gradient(to right, ${doc.data().colora}, ${doc.data().colorb}), url('${doc.data().image}');
                        background-position: center; background-repeat: no-repeat; background-size: cover;"
                >

                        <h4 style="color: #FFFFFF;text-align: center;">${doc.data().name}</h4>

                 </div></a>

`);

$('#postcontainer').append(div);

            })

        }

    })

}