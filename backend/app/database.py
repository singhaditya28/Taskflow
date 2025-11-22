from pymongo import MongoClient
from app.config import settings

# MongoDB client
client = MongoClient(settings.mongodb_url)
db = client[settings.database_name]

# Collections
users_collection = db["users"]
tasks_collection = db["tasks"]

# Create indexes for better performance
def init_db():
    """Initialize database indexes"""
    # User indexes
    users_collection.create_index("email", unique=True)
    
    # Task indexes
    tasks_collection.create_index("assigned_to")
    tasks_collection.create_index("created_by")
    tasks_collection.create_index("status")
    tasks_collection.create_index("due_date")
    
    print("Database indexes created successfully")

def get_database():
    """Get database instance"""
    return db
