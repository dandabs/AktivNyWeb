$(document).ready(populatePicker())

function populatePicker() {

    firebase.default.firestore().collection('categories').get().then((snap) => {

        if (snap.size != 0) {

            snap.forEach(doc => {

                console.log(doc.id + ' ' + doc.id + ' ' + doc.data().name);

                var sel = $(document.createElement('option'));

                $(sel).html(`
                <option value="${doc.id}">${doc.data().name}</option>
                `);

                $('#exampleFormControlSelect2').append(sel);

            })

        }

    });

}

function hexToRgbA(hex){ // from https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.75)'; // 0.75 = kinda transparent
    }
    throw new Error('Bad Hex');
}

function addCategory() {

    var id = $('#categoryid').val();
    var name = $('#categoryname').val();
    var colora = $('#categorycolora').val();
    var colorb = $('#categorycolorb').val();

    var dt = Math.round(new Date().getTime()/1000);

    var fileReader = new FileReader();
    fileReader.onload = function () {

      var data = fileReader.result; 

      var storageRef = firebase.storage().ref();
      var ref = storageRef.child('categoryimages/' + dt + '.png');

      ref.putString(data, 'data_url').then(function(snapshot) {
        console.log('Uploaded a base64 string!');
      });

    };

    fileReader.readAsDataURL($('#categoryimage').prop('files')[0]);

    firebase.default.firestore().collection('categories').doc(id).set({

        name: name,
        colora: hexToRgbA(colora),
        colorb: hexToRgbA(colorb),
        image: "https://firebasestorage.googleapis.com/v0/b/aktiv-ny.appspot.com/o/categoryimages%2F"+ dt + ".png?alt=media",

    }).then(_ => {

        window.location.replace('/category/' + id);

    })

}
