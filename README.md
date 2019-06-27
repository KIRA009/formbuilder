## Formbuilder
A small utility app to make and share forms and collect responses

## Installation
- Make sure `python3.x` is installed in your system and the environment variables are properly configured. Download python <a href='[https://www.python.org/downloads/](https://www.python.org/downloads/)'>here</a>

- Install `virtualenv`

	`pip install virtualenv` 
- Clone the project repo

	`git clone https://github.com/KIRA009/formbuilder.git`
- Go to the cloned folder in your system, and setup a virtualenv there
	```
	cd formbuilder
	virtualenv .
	```
- Activate the virtualenv

	`.\Scripts\activate`

- Install the required dependencies

	`pip install -r requirements.txt`

- Setup the `.env` file and adjust the values in `.env`  file accordingly

	` copy .env.example .env`

- Setup the database

	```
	flask db init
	flask db migrate
	flask db upgrade
	```
- Run the app

	`flask run`

- Open <a href='localhost:5000/register'>localhost:5000/register</a> and you are set to go