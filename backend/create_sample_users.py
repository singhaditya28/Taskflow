"""
Script to create sample users for testing
Run this after starting the backend server
"""
import requests

API_URL = "http://localhost:8000"

sample_users = [
    {
        "name": "Admin User",
        "email": "admin@goolluck.com",
        "password": "Admin@123",
        "role": "admin"
    },
    {
        "name": "Manager User",
        "email": "manager@goolluck.com",
        "password": "Manager@123",
        "role": "manager"
    },
    {
        "name": "Regular User",
        "email": "user@goolluck.com",
        "password": "User@123",
        "role": "user"
    }
]

def create_sample_users():
    print("Creating sample users...")
    
    for user in sample_users:
        try:
            response = requests.post(f"{API_URL}/api/auth/signup", json=user)
            if response.status_code == 201:
                print(f"✓ Created {user['role']}: {user['email']}")
            else:
                print(f"✗ Failed to create {user['email']}: {response.json().get('detail', 'Unknown error')}")
        except Exception as e:
            print(f"✗ Error creating {user['email']}: {str(e)}")
    
    print("\nSample users created successfully!")
    print("\nYou can now login with:")
    for user in sample_users:
        print(f"  {user['role'].capitalize()}: {user['email']} / {user['password']}")

if __name__ == "__main__":
    create_sample_users()
