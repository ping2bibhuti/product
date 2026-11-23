# Product Management Application

A full-stack Product Management application built using React, Python FastAPI, and PostgreSQL.

## Technologies Used

- Frontend: React, JavaScript, Bootstrap
- Backend: Python, FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy
- API Client: Axios

## Features

- Add products
- View products
- Update products
- Delete products
- Search products

## Project Structure

- `frontend/` – React application
- `backend/` – FastAPI application

## Backend Setup

```bash
cd backend
python -m venv myenv
myenv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Database Configuration

Create a PostgreSQL database named `product_db` and configure the connection URL in the backend `.env` file.

## API Documentation

Once FastAPI is running, open:

http://127.0.0.1:8000/docs


## Check required installation of virtual environment
Step 1: Activate your virtual environment

Your terminal already shows (myenv), so it appears activated.
myenv\Scripts\activate

Right click on this path and copy it, and pest in command prontmpt, enter
C:\Users\BIBHUTI\Python-Course\Python-FastAPI-React-PostgreSQL\myenv\Scripts\activate.bat

showing (myenv)  before the command line. It confirm virtula environment is working
(myenv) C:\Users\BIBHUTI\Python-Course\Python-FastAPI-React-PostgreSQL>

Step 2: Install SQLAlchemy
python -m pip install sqlalchemy

Since your project uses FastAPI with PostgreSQL, also install the PostgreSQL driver:
python -m pip install "psycopg[binary]"

If you are using SQLAlchemy with this connection URL:
DATABASE_URL = "postgresql+psycopg://postgres:password@localhost:5432/library_db"

The psycopg driver is required.

Step 3: Verify installation
python -m pip show sqlalchemy
python -m pip show psycopg

Step 4: Start Uvicorn again
uvicorn main:app --reload

Expected output:
INFO: Uvicorn running on http://127.0.0.1:8000
INFO: Application startup complete.

Step 5: Test FastAPI
Open your browser:
http://127.0.0.1:8000/docs

Recommended: Install all project dependencies together
For your FastAPI + React + PostgreSQL project, you can install these Python packages:
python -m pip install fastapi uvicorn sqlalchemy "psycopg[binary]" python-dotenv pydantic

Save installed dependencies:
pip freeze > requirements.txt

Later, you can install all dependencies using:
pip install -r requirements.txt

------

=> Activate again when required
For Windows CMD:
myenv\Scripts\activate

=> Try this command for deactivate
In your current CMD terminal, run:
myenv\Scripts\deactivate.bat

----

