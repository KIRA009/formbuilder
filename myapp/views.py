from flask import render_template, request, redirect, jsonify, url_for
from flask_login import login_user, login_required, current_user, logout_user
from datetime import datetime as dt

from run import app, login_manager
from .models import User, Form, FilledForm


@login_manager.user_loader
def load_user(username):
	return User.query.filter_by(username=username).first()


login_manager.login_view = 'login'


@app.route('/check-username', methods=['GET'])
def check():
	if User.get(request.args.get('username')):
		return 'Username already taken'
	return 'Username available'


@app.route('/register', methods=['GET', 'POST'])
def register():
	if request.method == 'GET':
		return render_template('register.html')
	elif request.method == 'POST':
		data = request.form
		user = User(data)
		if user.create():
			print('Here')
			return redirect('login')
		else:
			return redirect('register')


@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'GET':
		return render_template('login.html')
	elif request.method == 'POST':
		data = request.form
		user = User.get(data['username'])
		if not user:
			return redirect('login')
		if user.authenticate(data['password']):
			login_user(user)
			if request.args.get('next'):
				return redirect(request.args['next'])
			return redirect(url_for('home'))
		return redirect('login')


@app.route('/home/create', methods=['GET', 'POST'])
@login_required
def home():
	user = current_user
	context = {
		'user': user
	}
	if request.method == 'GET':
		return render_template('create-form.html', context=context)
	elif request.method == 'POST':
		form = Form(request.form, user=current_user)
		form.create()
		return ''


@app.route('/home/created', methods=['GET'])
@login_required
def created():
	user = current_user
	context = {
		'user': user
	}
	forms = [form.detail() for form in user.forms]
	context['forms'] = forms
	return render_template('created-forms.html', context=context)


@app.route('/home/form/fill/<form_id>', methods=['GET', 'POST'])
@login_required
def fill_form(form_id):
	user = current_user
	form = Form.get(form_id)
	if not form:
		return redirect(url_for('home'))
	if request.method == 'GET':
		form_filled = FilledForm.get(form_id, user.username)
		if form_filled:
			return redirect(url_for('filled_form', form_id=form_filled.id))
		expired = form.date < dt.now() if form.date else False
		return render_template('fill-form.html', form=form.detail(), expired=expired)
	if request.method == 'POST':
		if form.user == user:
			return redirect(url_for('home'))
		FilledForm(request.form['response'], user, form_id).create()
		return ''


@app.route('/home/filled', methods=['GET'])
@login_required
def filled():
	user = current_user
	context = {'user': user}
	forms = user.filled_forms
	context['forms'] = forms
	return render_template('filled.html', context=context)


@app.route('/home/form/filled/<form_id>', methods=['GET'])
@login_required
def filled_form(form_id):
	form = FilledForm.query.filter_by(id=form_id).first()
	if form.user == current_user or form.filled.user == current_user:
		return render_template('filled-form.html', form=form)
	return redirect(url_for('filled'))


@app.route('/logout', methods=['GET'])
@login_required
def logout():
	logout_user()
	return redirect('login')
