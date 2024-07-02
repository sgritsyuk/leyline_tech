from pymongo import MongoClient
from config import MONGO_URL, MONGO_DB

db_client = MongoClient(MONGO_URL)
db = db_client[MONGO_DB]
