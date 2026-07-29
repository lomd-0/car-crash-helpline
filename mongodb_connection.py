import os

from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from fastapi.middleware.cors import CORSMiddleware

uri = os.getenv("MONGODB_URI")

if not uri:
    raise RuntimeError("MONGODB_URI environment variable is not set")

client = MongoClient(uri, server_api=ServerApi('1'))
db = client["WebsiteData"]
users = db["users"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegisterRequest(BaseModel):
    fullName: str
    email: str
    phone: str
    carPlate: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/register")
def register_user(data: RegisterRequest):
    if users is None:
        return {"message": "Database is not configured yet. Please set MONGODB_URI."}

    email_exists = users.find_one({"email": data.email.lower()}) is not None
    phone_exists = users.find_one({"phone": data.phone}) is not None
    plate_exists = users.find_one({"carPlate": data.carPlate.upper()}) is not None

    if email_exists or phone_exists or plate_exists:
        return {"message": "One of the provided details has already been used. Please choose a different email, phone number, or car plate."}

    users.insert_one({
        "fullName": data.fullName,
        "email": data.email.lower(),
        "phone": data.phone,
        "carPlate": data.carPlate.upper(),
        "password": data.password
    })

    return {"message": "Registration successful."}

@app.post("/api/login")
def login_user(data: LoginRequest):
    if users is None:
        return {"message": "Database is not configured yet. Please set MONGODB_URI."}

    user = users.find_one({"email": data.email.lower()})

    if not user:
        return {"message": "No account found with that email."}

    if user.get("password") != data.password:
        return {"message": "Incorrect password."}

    return {
        "message": "Login successful.",
        "user": {
            "fullName": user.get("fullName"),
            "email": user.get("email"),
            "phone": user.get("phone"),
            "carPlate": user.get("carPlate")
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

