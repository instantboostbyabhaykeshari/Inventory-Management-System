from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int

class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True

class CustomerCreate(BaseModel):
    full_name: str
    email: str
    phone: str

class CustomerResponse(CustomerCreate):
    id: int

    class Config:
        from_attributes = True



class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True