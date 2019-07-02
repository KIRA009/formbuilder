import uuid
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime as dt

from run import db


class User(db.Model, UserMixin):
	id = db.Column(db.String(256))
	username = db.Column(db.String(128), primary_key=True)
	password = db.Column(db.String(256))
	forms = db.relationship('Form', backref='user', lazy=True)
	filled_forms = db.relationship('FilledForm', backref='user', lazy=True)

	def __init__(self, data):
		db_data = data.copy()
		db_data['id'] = str(uuid.uuid4())
		db_data['password'] = generate_password_hash(data['password'])
		super().__init__(**db_data)

	def create(self):
	    for key, value in self.__dict__.items():
	        if key.startswith('_'):
	            pass
	        self.__dict__[key] = value[0] if isinstance(value, list) else value  # workaround for pythonanywhere
	    db.session.add(self)
	    try:
	        db.session.commit()
	        return True
	    except IntegrityError:
	        return False

	@staticmethod
	def get(username):
		return User.query.filter_by(username=username).first()

	def detail(self):
		return {
			'id': self.id,
			'name': self.username,
		}

	@staticmethod
	def is_active(**kwargs):
		return True

	def authenticate(self, password):
		return check_password_hash(self.password, password)

	def change_pwd(self, password):
		self.password = generate_password_hash(password)
		db.session.commit()

	def get_id(self):
		return self.username


class Form(db.Model):
	id = db.Column(db.String(256), primary_key=True)
	username = db.Column(db.String(128), db.ForeignKey('user.username'), nullable=False)
	title = db.Column(db.String(256))
	desc = db.Column(db.String(256))
	form = db.Column(db.Text)
	date = db.Column(db.DateTime, default=None)
	filled = db.relationship('FilledForm', backref='filled', lazy=True)

	def __init__(self, data, user):
		db_data = dict()
		db_data['id'] = str(uuid.uuid4())
		db_data['title'] = data['title']
		db_data['desc'] = data['desc']
		db_data['form'] = data['form']
		db_data['username'] = user.username
		if data['date'] != '':
			db_data['date'] = dt.strptime(data['date'], '%Y-%m-%dT%H:%M')
		super().__init__(**db_data)

	def create(self):
		db.session.add(self)
		try:
			db.session.commit()
			return True
		except IntegrityError:
			return False

	def detail(self):
		return {
			'id': self.id,
			'user': self.username,
			'title': self.title,
			'desc': self.desc,
			'form': self.form,
			'fillers': [(filled.username, filled.id) for filled in self.filled],
		}

	@staticmethod
	def get(form_id):
		return Form.query.filter_by(id=form_id).first()


class FilledForm(db.Model):
	id = db.Column(db.String(256), primary_key=True)
	username = db.Column(db.String(128), db.ForeignKey('user.username'), nullable=False)
	form = db.Column(db.String(256), db.ForeignKey('form.id'), nullable=False)
	response = db.Column(db.Text)

	def __init__(self, response, user, form):
		super().__init__(**{'response': response, 'username': user.username, 'form': form, 'id': str(uuid.uuid4())})

	def create(self):
		db.session.add(self)
		try:
			db.session.commit()
			return True
		except IntegrityError:
			return False

	@staticmethod
	def get(form, username):
		return FilledForm.query.filter_by(form=form, username=username).first()
