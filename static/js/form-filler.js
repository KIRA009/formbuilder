import FormBuilder from './form-builder.js'

var edit_form = document.getElementById('edit-form');

let form_template = JSON.parse(edit_form.getAttribute('form'));
edit_form.removeAttribute('form');
for (var index in form_template)
    form_template[index].config.creating = false;


const show_alert = (alert_class, message) => {
    let alert = document.getElementsByClassName('form-alert')[0];
    alert.classList.add('show');
    alert.classList.add('alert-' + alert_class);
    alert.innerHTML = message;
    window.scrollTo(0, 0)
    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.remove('alert-' + alert_class);
        alert.innerHTML = '';
    }, 3000)
}

const ajax = (url, params={}) => {
    let xhttp = new XMLHttpRequest();
    let form_data = new FormData();
    for (var key in params)
        form_data.append(key, params[key])
    xhttp.open('POST', url, true);
    xhttp.send(form_data);

    return xhttp;
}

const render = () => {
    while (edit_form.firstChild) {
        edit_form.removeChild(edit_form.firstChild);
    }
    for (var index in form_template) {
        edit_form.appendChild(new FormBuilder(form_template[index], index).render());
    }
}

const fill_input = (index) => {
    form_template[index].vals.value = (document.getElementById('id' + index).value === '') ? null : document.getElementById('id' + index).value;
}

const fill_textarea = (index) => {
    form_template[index].vals.value = (document.getElementById('id' + index).value === '') ? null : document.getElementById('id' + index).value;
}

const fill_checkbox = (index) => {
    let options = form_template[index].options.slice(0, );
    form_template[index].options = new Object();
    for (var ind in options)
        form_template[index].options[options[ind]] = document.getElementById('ch' + index + 'ck' + ind).checked
}

var submit = document.querySelector('.create-form form').onsubmit = (evt) => {
    let types = {
        input: fill_input,
        textarea: fill_textarea,
        checkbox: fill_checkbox,
        radio: fill_checkbox
    }
    evt.preventDefault();
    for (var index in form_template) {
        let el = form_template[index];
        if (el.type === 'checkbox' || el.type === 'radio') {
            if (el.config.required) {
                if (document.querySelectorAll('div[index="' + index + '"] > div input:checked').length === 0) {
                    show_alert('danger', 'Please fill all required fields');
                    return
                }
            }
        }
    }
    for (var index in form_template) {
        types[form_template[index].type](index);
    }

    let res = ajax(window.location.href, {response: JSON.stringify(form_template)})
    res.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location = '/home/filled'
        }
    };
}

render();