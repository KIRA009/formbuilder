var show_pass = document.getElementById('show-pass');
var password = document.getElementById('password');
show_pass.onclick = (evt) => {
    password.setAttribute('type', (password.getAttribute('type') === 'text') ? 'password' : 'text');
    show_pass.innerHTML = (password.getAttribute('type') === 'text') ? 'Hide Password' : 'Show password'
}

document.querySelector('a[href="' + window.location.pathname + '"]').classList.add('active')

var menu = document.querySelector('.navbar-toggler').onclick = evt => {
    if (document.getElementById('main-navbar').classList.contains('show')) {
        document.getElementById('main-navbar').classList.remove('show');
        document.getElementById('main-navbar').style.paddingRight = '';
    }
    else {
        document.getElementById('main-navbar').classList.add('show');
        document.getElementById('main-navbar').style.paddingRight = '44px';
    }
}

try {
    document.getElementById('login').onsubmit = (evt) => {
        evt.target.setAttribute('action', window.location.pathname + window.location.search);
    }
}

catch {
    document.getElementById('username').oninput = (evt) => {
        if (evt.target.value === '') {
            document.getElementById('available').innerHTML = ''
            return;
        }
        let xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/check-username?username=' + evt.target.value, true);
        xhttp.send();
        xhttp.onreadystatechange = function(evt) {
            if (this.readyState === 4) {
                document.getElementById('available').innerHTML = this.response
            }
        }
    }
}