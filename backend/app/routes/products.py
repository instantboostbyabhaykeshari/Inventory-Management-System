from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import Product
from ..schemas import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):

    existing_product = db.query(Product).filter(Product.sku == product.sku).first()

    if existing_product:
        raise HTTPException(status_code=400, detail="SKU already exists")

    if product.quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")

    new_product = Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        quantity=product.quantity
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    updated_product: ProductCreate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing_sku = db.query(Product).filter(
        Product.sku == updated_product.sku,
        Product.id != product_id
    ).first()

    if existing_sku:
        raise HTTPException(status_code=400, detail="SKU already exists")

    if updated_product.quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")

    product.name = updated_product.name
    product.sku = updated_product.sku
    product.price = updated_product.price
    product.quantity = updated_product.quantity

    db.commit()
    db.refresh(product)

    return product


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}