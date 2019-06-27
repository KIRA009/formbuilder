import FormBuilder from './form-builder.js'

let templates = {
    inputtext_template: {
        type: 'input',
        attributes: {
            type: 'text',
            placeholder: 'Short Answer text',
        },
        config: {
            desc: false,
            creating: true,
            required: false,
        },
        vals: {
            question: null,
            desc: null
        }
    },
    inputnum_template: {
        type: 'input',
        attributes: {
            type: 'number',
            placeholder: 'A number, perhaps',
        },
        config: {
            desc: false,
            creating: true,
            required: false,
        },
        vals: {
            question: null,
            desc: null
        }
    },
    textarea_template: {
        type: 'textarea',
        attributes: {
            placeholder: 'Long Answer text',
            rows: 5
        },
        config: {
            desc: false,
            creating: true,
            required: false,
        },
        vals: {
            question: null,
            desc: null
        }
    },
    checkbox_template: {
        type: 'checkbox',
        options: [
            'Yes (default checkbox option)',
            'No (default checkbox option)'
        ],
        config: {
            desc: false,
            creating: true,
            required: false
        },
        vals: {
            question: null,
            desc: null
        }
    },
    radio_template: {
        type: 'radio',
        options: [
            'Yes (default radio option)',
            'No (default radio option)'
        ],
        config: {
            desc: false,
            creating: true,
            required: false
        },
        vals: {
            question: null,
            desc: null
        }
    },
    form_template: [],
}

var edit_form = document.getElementById('edit-form');
document.querySelectorAll('i').forEach((el) => {
    el.onclick = (evt) => add_template(el.getAttribute('data-type'));
})

document.querySelector('img[data-type="checkbox"]').onclick = (evt) => add_template('checkbox');

const ajax = (method, url, params={}) => {
    let xhttp = new XMLHttpRequest();
    let form_data = new FormData();
    if (method === 'POST') {
        for (var key in params)
            form_data.append(key, params[key])
    }
    xhttp.open(method, url, true);
    xhttp.send(form_data);

    return xhttp;
}

const show_alert = (alert_class, message) => {
    let alert = document.getElementsByClassName('form-alert')[0];
    alert.classList.add('show');
    alert.classList.add('alert-' + alert_class);
    alert.innerHTML = message
    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.remove('alert-' + alert_class);
        alert.innerHTML = '';
    }, 3000)
}
const delete_field = (evt) => {
    templates.form_template.splice(evt.target.parentElement.parentElement.getAttribute('index'), 1);
    render();
}

const toggle_required_option = (evt) => {
    templates.form_template[evt.target.parentElement.parentElement.getAttribute('index')].config.required = evt.target.checked;
    render();
}

const toggle_add_desc = (evt) => {
    templates.form_template[evt.target.parentElement.parentElement.getAttribute('index')].config.desc = evt.target.checked;
    render();
}

const detect_input_change = (evt) => {
    let target = evt.target.getAttribute('placeholder') === 'Question' ? 'question' : 'desc'
    templates.form_template[evt.target.parentElement.getAttribute('index')].vals[target] = evt.target.value;
    render();
}

let reg = new RegExp(/\w{2}(\d+)\w{2}(\d+)/)
const detect_option_change = (evt) => {
    let [ind1, ind2] = reg.exec(evt.target.getAttribute('for')).slice(1, );
    templates.form_template[ind1].options[ind2] = evt.target.value;
    render();
}

const detect_option_add = (evt) => {
    templates.form_template[evt.target.parentElement.parentElement.getAttribute('index')].options.push('')
    render();
}

const detect_option_del = (evt) => {
    let [ind1, ind2] = reg.exec(evt.target.parentElement.previousElementSibling.getAttribute('for')).slice(1, )
    if (templates.form_template[ind1].options.length == 1) {
        show_alert('danger', 'Cannot have a field with 0 options')
        window.scrollTo(0, 0);
        return
    }
    templates.form_template[ind1].options.splice(ind2, 1);
    render();
}

const add_template = (type) => {
    let new_template = JSON.parse(JSON.stringify(templates[type + '_template']));
    templates.form_template.push(new_template);
    render();
    window.scrollTo({
        left:0, 
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

const render = () => {
    while (edit_form.firstChild) {
        edit_form.removeChild(edit_form.firstChild);
    }
    for (var index in templates.form_template) {
        edit_form.appendChild(new FormBuilder(templates.form_template[index], index, delete_field, toggle_required_option, toggle_add_desc,
            detect_input_change, detect_option_change, detect_option_add, detect_option_del).render());
    }
}

var submit = document.querySelector('.create-form form').onsubmit = (evt) => {
    evt.preventDefault();
    if (templates.form_template.length === 0) {
        show_alert('danger', 'There are no form fields')
        return;
    }
    let date = document.getElementById('date');
    if (date.value !== '') {
        if (new Date() > new Date(date.value)) {
            show_alert('danger', 'Date entered is in the past!!!');
            return;
        }
    }
    let params = {
        title: document.getElementsByClassName('title')[0].value,
        desc: document.getElementsByClassName('desc')[0].value,
        form: JSON.stringify(templates.form_template),
        date: date.value
    }
    let form_create = ajax('POST', '/home/create', params);
    form_create.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            show_alert('success', 'Form succesfully created')
        }
    };
}

render();