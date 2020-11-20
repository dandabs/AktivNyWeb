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
