from app_builder import build_app
import os

ROOT_DIR = os.getcwd()

app, db, migrate, login_manager = build_app(app_name=__name__, env_path=ROOT_DIR + '\.env', config_env='SETTINGS')

from myapp.views import *

if __name__ == '__main__':
    app.run()
