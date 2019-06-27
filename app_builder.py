from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
from flask_login import LoginManager
import os


def build_app(app_name, env_path, config_env):
	load_dotenv(dotenv_path=env_path)
	app = Flask(app_name)
	app.config.from_envvar(config_env)
	app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
	app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB')
	db = SQLAlchemy(app)
	migrate = Migrate(app, db)
	login_manager = LoginManager(app)

	return app, db, migrate, login_manager

