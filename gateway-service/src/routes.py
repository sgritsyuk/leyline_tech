import os
import shutil
import uuid
from bson import ObjectId
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from celery import Celery
from config import PATH_UPLOADS, PATH_VIDEOS, MONGO_COLLECTION_TASKS, CELERY_BROKER_URL
from mongo import db


router = APIRouter()
worker = Celery('worker', broker=CELERY_BROKER_URL)


@router.get("/api/v1/ping")
async def ping():
    return {"message": "pong"}


@router.post("/api/v1/task")
async def task_create(file: UploadFile = File(...)):
    # save file
    fn = str(uuid.uuid4()) + "." + file.filename.split(".")[-1]
    filename = os.path.join(PATH_UPLOADS, fn)
    with open(filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # insert to the database
    result = await db.get_collection(MONGO_COLLECTION_TASKS).insert_one(
        {
            "status": "PENDING",
            "progress": 0,
            "filename": filename,
            "message": None,
        }
    )
    # return inserted id and send task to the queue
    inserted_id = str(result.inserted_id)
    worker.send_task('generate_video', [inserted_id])
    return {"id": inserted_id}


@router.get("/api/v1/task/{id}")
async def task_get(id):
    task = await db.get_collection(MONGO_COLLECTION_TASKS).find_one({"_id": ObjectId(id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {
        "status": task["status"],
        "progress": task["progress"],
        "filename": task["filename"],
        "message": task["message"],
    }


@router.get("/api/v1/video/{id}")
async def video_get(id):
    # check if task exists and processed
    task = await db.get_collection(MONGO_COLLECTION_TASKS).find_one({"_id": ObjectId(id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task["status"] != "FINISHED":
        raise HTTPException(status_code=404, detail="Task not processed yet")
    video_filename = os.path.join(PATH_VIDEOS, id)
    if not os.path.exists(video_filename):
        raise HTTPException(status_code=404, detail="Video not found")
    # stream video file
    def iterfile():
        with open(video_filename, mode="rb") as file_like:
            yield from file_like
    return StreamingResponse(iterfile(), media_type="video/mp4")
