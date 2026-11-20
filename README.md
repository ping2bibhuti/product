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