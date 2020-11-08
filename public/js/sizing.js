const body = document.querySelector('body');
const div = document.querySelector('#loginbg');

function reportWindowSize() {
    document.getElementById('loginbg').style.width = body.clientWidth;
    document.getElementById('loginbg').style.height = body.clientHeight;

    console.log(body.clientWidth + "x" + body.clientHeight + " : " + div.clientWidth + "x" + div.clientHeight);

}

window.onresize = reportWindowSize;