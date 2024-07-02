db = new Mongo().getDB('leyline');
db.createCollection('tasks', { capped: false });