from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ProductCreate, ProductResponse
from database import session, engine
import database_models
from sqlalchemy.orm import Session
from sqlalchemy import asc

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database_models.Base.metadata.create_all(bind=engine)


# Initial product data
products = [
    {"name": "Laptop", "description": "Dell laptop", "price": 55000.00, "quantity": 10},
    {"name": "Mobile", "description": "Samsung smartphone", "price": 25000.00, "quantity": 15},
    {"name": "Keyboard", "description": "Wireless keyboard", "price": 1200.00, "quantity": 25},
    {"name": "Mouse", "description": "Optical wireless mouse", "price": 750.00, "quantity": 30},
    {"name": "Monitor", "description": "24 inch LED monitor", "price": 12000.00, "quantity": 8},
    {"name": "Headphones", "description": "Bluetooth headphones", "price": 2500.00, "quantity": 20},
    {"name": "Tablet", "description": "Android tablet", "price": 18000.00, "quantity": 12},
    {"name": "Printer", "description": "HP laser printer", "price": 15000.00, "quantity": 6},
    {"name": "Webcam", "description": "Full HD webcam", "price": 1800.00, "quantity": 18},
    {"name": "Speaker", "description": "Bluetooth speaker", "price": 3200.00, "quantity": 14}
]

def get_db():
   db = session()
   try:
      yield db
   finally:
       db.close()
              

def init_db():
    db = session()

    try:
        # Check existing records
        existing_product = db.query(database_models.Product).first()
        if existing_product is None:

            db.add_all([
                database_models.Product(**product)
                for product in products
            ])
            db.commit()

            print("Products inserted successfully!")

        else:
            print("Products already exist!")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()

init_db()

# Home API  
@app.get("/")
def greet():
  return "Welcome to library management"


# GET all products
@app.get("/products", response_model=list[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
  db_products = db.query(database_models.Product).order_by(asc(database_models.Product.id)).all()
  return db_products


# GET product by ID
@app.get("/products/{id}", response_model=ProductResponse)
def get_product_by_id(id:int, db: Session = Depends(get_db)):
  db_products = db.query(database_models.Product).filter(database_models.Product.id == id).first()
  for product in products:
    if product.id == id:
      return db_products
  return "product not found"


# POST - Add new product
@app.post("/products", response_model=ProductResponse, status_code=201)
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
  try:
        # Convert Pydantic object into SQLAlchemy object
        new_product = database_models.Product(
            **product.model_dump()
        )

        # Add product to session
        db.add(new_product)

        # Save data permanently in PostgreSQL
        db.commit()

        # Get generated ID from database
        db.refresh(new_product)

        return new_product

  except Exception as e:
      db.rollback()
      print("DATABASE ERROR:", repr(e))
      raise HTTPException(
          status_code=500,
          detail=str(e)
      )



# PUT - Update existing product
@app.put("/products/{id}", response_model=ProductResponse)
def update_product(
    id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    # Find product by ID
    db_product = db.query(database_models.Product).filter(
        database_models.Product.id == id
    ).first()

    # Check whether product exists
    if db_product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    try:
        # Update product fields
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity

        # Save changes in PostgreSQL
        db.commit()

        # Refresh updated record
        db.refresh(db_product)

        return db_product

    except Exception as e:
        db.rollback()

        print("UPDATE DATABASE ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Unable to update product"
        )


# DELETE - Delete product by ID
@app.delete("/products/{id}")
def delete_product(
    id: int,
    db: Session = Depends(get_db)
):

    # Find product by ID
    db_product = db.query(database_models.Product).filter(
        database_models.Product.id == id
    ).first()

    # Check whether product exists
    if db_product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    try:
        # Delete product
        db.delete(db_product)

        # Save changes in PostgreSQL
        db.commit()

        return {
            "message": "Product deleted successfully",
            "product_id": id
        }

    except Exception as e:
        db.rollback()

        print("DELETE DATABASE ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Unable to delete product"
        )
