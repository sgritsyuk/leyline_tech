from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URL, MONGO_DB

db_client = AsyncIOMotorClient(MONGO_URL)
db = db_client[MONGO_DB]
