const create = (tagname, attributes={}, value=null, evtlistener={}) => {
    let elem = document.createElement(tagname);
    for (var key in attributes)
        elem.setAttribute(key, attributes[key])
    if (value !== null) {
        tagname === 'input' ? elem.value = value : elem.appendChild(document.createTextNode(value))
    }
    for (var key in evtlistener)
        elem.addEventListener(key, evtlistener[key]);
    return elem
}
const add_child = (par, child) => {
    par.appendChild(child);
    return par
}

export default class FormBuilder {
    constructor(element, index, 
        delete_field=null, toggle_required_option=null, toggle_add_desc=null, detect_input_change=null,
        detect_option_change=null, detect_option_add=null, detect_option_del=null) {
        this.data = element;
        this.key = index;
        this.config = this.data.config;
        this.vals = this.data.vals;
        this.attributes = this.data.attributes;
        this.delete_field = delete_field;
        this.toggle_required_option = toggle_required_option;
        this.toggle_add_desc = toggle_add_desc;
        this.detect_input_change = detect_input_change;
        this.detect_option_change = detect_option_change;
        this.detect_option_add = detect_option_add;
        this.detect_option_del = detect_option_del;
    }

    add_del = () => {
        return add_child(create('span', {
            class: 'delete',
            title: 'Delete',
        }), create('i', {class: 'fas fa-trash'}, null, {click: this.delete_field}));
    }

    add_require = () => {
        let attributes = {
            'type': 'checkbox',
            'id': 'required' + this.key,
        }
        if (this.config.required)
            attributes.checked = true;
        return add_child(
            add_child(
                create('div', {'style': 'margin-top: 20px;'}),
                create('input', attributes, null, {change: this.toggle_required_option})), 
                create('label', {
                    for: 'required' + this.key
                }, 'Required'));
    }

    add_desc = () => {
        let attributes = {
            'type': 'checkbox',
            'id': 'desc' + this.key,
        }
        if (this.config.desc)
            attributes.checked = true;
        return add_child(
            add_child(
                create('div', {}),
                create('input', attributes, null, {change: this.toggle_add_desc})), 
                create('label', {
                    for: 'desc' + this.key
                }, 'Description'));
    }

    label = () => {
        if (this.config.creating) {
            return create('input', {
                placeholder: "Question",
                type: "text",
                class: 'form-control',
                required: true,
                style: 'font-size: 24px'
            }, this.vals.question, {change: this.detect_input_change})
        }
        else {
            if (this.config.required)
                return add_child(create('label', {for: 'id' + this.key, class: 'fill-label'}, this.vals.question), create('span', {class: 'text-danger'}, '*'))
            return create('label', {for: 'id' + this.key, class: 'fill-label'}, this.vals.question)
        }
    }

    input = () => {
        let attributes = {
            id: 'id' + this.key,
            class: 'form-control',
            ...this.attributes
        }
        if (this.config.required)
            attributes['required'] = true
        if (this.config.creating) {
            attributes['readonly'] = true
            return create('input', attributes)
        }
        else {
            if (this.vals.value !== undefined ) {
                attributes['readonly'] = true
                delete attributes['placeholder']
            }
            return create('input', attributes, this.vals.value)
        }
    }

    textarea = () => {
        let attributes = {
            id: "id" + this.key,
            class: 'form-control',
            ...this.attributes
        }
        if (this.config.required)
            attributes['required'] = true;
        if (this.config.creating) {
            attributes['readonly'] = true
            return create('textarea', attributes);
        }
        else {
            if (this.vals.value !== undefined ) {
                delete attributes['placeholder']
                attributes['readonly'] = true
            }
            return create('textarea', attributes, this.vals.value)
        }
    }

    checkbox = () => {
        let options = this.data.options;
        let div = create('div', {class: 'edit-checkbox', id: this.key});
        if (this.config.creating) {
            for (var index in options) {
                let for_id = 'ch' + this.key + 'ck' + index;
                div = add_child(add_child(div, create('input', {required: true, class: 'form-control', placeholder: 'Enter option', for: for_id}, options[index], {change: this.detect_option_change})),
                add_child(create('span', {class: 'delete check', title: 'Delete option'}), create('i', {class: 'fas fa-trash', 'aria-hidden': true}, null, {click: this.detect_option_del})))
            }
            return add_child(div, create('small', {}, '+', {click: this.detect_option_add}));
        }
        else {
            div.classList.add('form-check');
            if (this.config.required) div.classList.add('required')
            let i = 0;
            let attributes = {class: 'form-check-input', type: 'checkbox'}

            for (var index in options) {
                let for_id = 'ch' + this.key + 'ck' + i;
                attributes['id'] = for_id;
                let val = options[index];
                if (options.constructor === Object) {
                    attributes['disabled'] = true;
                    if (options[index]) 
                        attributes['checked'] = true;
                    val = index;
                }
                div = add_child(add_child(add_child(div, create('input', attributes)), 
                    create('label', {class: 'form-check-label', for: for_id}, val)), create('br'));
                i++;
                delete attributes['checked']
            }
            return div;
        }
    }

    radio = () => {
        let options = this.data.options;
        let div = create('div', {class: 'edit-checkbox', id: this.key});
        if (this.config.creating) {
            for (var index in options) {
                let for_id = 'ch' + this.key + 'ck' + index;
                div = add_child(add_child(div, create('input', {required: true, class: 'form-control', placeholder: 'Enter option', for: for_id}, options[index], {change: this.detect_option_change})),
                add_child(create('span', {class: 'delete check', title: 'Delete option'}), create('i', {class: 'fas fa-trash', 'aria-hidden': true}, null, {click: this.detect_option_del})))
            }
            return add_child(div, create('small', {}, '+', {click: this.detect_option_add}));
        }
        else {
            div.classList.add('form-check');
            if (this.config.required) div.classList.add('required')
            let i = 0;
            let attributes = {class: 'form-check-input', type: 'radio', name: 'radio' + this.key}

            for (var index in options) {
                let for_id = 'ch' + this.key + 'ck' + i;
                attributes['id'] = for_id;
                let val = options[index];
                if (options.constructor === Object) {
                    attributes['disabled'] = true;
                    if (options[index]) 
                        attributes['checked'] = true;
                    val = index;
                }
                div = add_child(add_child(add_child(div, create('input', attributes)), 
                    create('label', {class: 'form-check-label', for: for_id}, val)), create('br'));
                i++;
                delete attributes['checked']
            }
            return div;
        }
    }

    desc = () => {
        if (this.config.creating) {
            if (this.config.desc) {
                return create('input', {
                    class: 'form-control',
                    type: 'text',
                    placeholder: 'Description',
                    required: true
                }, this.vals.desc, {change: this.detect_input_change})
            }
        }
        if (this.config.desc) {
            return create('small', {}, this.vals.desc)
        }
    }

    render = () => {
        let div = create('div', {
            class: "form-group text-left editable",
            index: this.key,
            tabindex: '0'
        });
        if (this.config.creating)
            add_child(div, this.add_del())
        div = add_child(add_child(div, this.label()), eval('this.' + this.data['type'] + '()'));
        !this.config.desc ? (null) : (div.appendChild(this.desc()));
        if (this.config.creating) {
            div = add_child(add_child(div, this.add_require()), this.add_desc());
        }
        return div;
    }
}