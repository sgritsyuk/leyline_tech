import time
import os
import logging
import shutil
from celery import Celery
from config import CELERY_BROKER_URL, PATH_VIDEOS, MONGO_COLLECTION_TASKS
from bson import ObjectId
from mongo import db


app = Celery('worker', broker=CELERY_BROKER_URL)

@app.task(name='generate_video')
def generate_video(task_id):
    db_collection = db.get_collection(MONGO_COLLECTION_TASKS)
    db_object_id = ObjectId(task_id)
    # check task
    task = db_collection.find_one({"_id": db_object_id})
    if not task:
        logging.error(f"Task #{task_id} not found")
        return
    if task["status"] == "FINISHED":
        logging.error(f"Task #{task_id} already processed")
        return
    # task processing, 30 sec
    for i in range(30):
        progress = round(100 / 30 * (i + 1))
        db_collection.update_one(
            {"_id": db_object_id},
            {"$set": {"progress": progress, "status": "PROCESSING"}},
        )
        time.sleep(1.0)
    # finalize processing
    shutil.copyfile("/app/mock_video.mp4", os.path.join(PATH_VIDEOS, task_id))
    db_collection.update_one(
        {"_id": db_object_id},
        {"$set": {"progress": 100, "status": "FINISHED"}},
    )
