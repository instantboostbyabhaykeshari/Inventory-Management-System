from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import Product, Customer, Order, OrderItem
from ..schemas import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(
        Customer.id == order.customer_id
    ).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    total_amount = 0

    new_order = Order(
        customer_id=order.customer_id,
        total_amount=0
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    order_items_response = []

    for item in order.items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product ID {item.product_id} not found"
            )

        if item.quantity <= 0:
            raise HTTPException(
                status_code=400,
                detail="Quantity must be greater than zero"
            )

        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        item_total = product.price * item.quantity

        total_amount += item_total

        product.quantity -= item.quantity

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )

        db.add(order_item)

        order_items_response.append(order_item)

    new_order.total_amount = total_amount

    db.commit()
    db.refresh(new_order)

    new_order.items = order_items_response

    return new_order


@router.get("/", response_model=list[OrderResponse])
def get_orders(db: Session = Depends(get_db)):

    orders = db.query(Order).all()

    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(order)

    db.commit()

    return {"message": "Order deleted successfully"}