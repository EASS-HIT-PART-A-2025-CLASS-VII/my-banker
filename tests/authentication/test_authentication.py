import requests

# Base URL for the authentication endpoints
BASE_URL = "http://localhost:8000/auth"

#Test Case: Register a new user.
def test_register_user():
    
    # Define the payload with the new user's credentials
    payload = {
        "username": "testuser",
        "password": "testpassword"
    }
    # Send a POST request to the /auth/register endpoint
    response = requests.post(f"{BASE_URL}/register", json=payload)
    # Assert that the HTTP status code is 201 (Created)
    assert response.status_code == 201
    # Assert that the response message indicates successful registration
    assert response.json()["message"] == "User registered successfully"

#Test Case: Attempt to register an already existing user.
def test_register_existing_user():
    # Define the payload with the existing user's credentials
    payload = {
        "username": "testuser",
        "password": "testpassword"
    }
    # Send a POST request to the /auth/register endpoint
    response = requests.post(f"{BASE_URL}/register", json=payload)
    # Assert that the HTTP status code is 400 (Bad Request)
    assert response.status_code == 400
    # Assert that the response message indicates the user already exists
    assert response.json()["message"] == "User already exists"

#Test Case: Log in with valid credentials.
def test_login_user():
    # Define the payload with valid login credentials
    payload = {
        "username": "testuser",
        "password": "testpassword"
    }
    # Send a POST request to the /auth/login endpoint
    response = requests.post(f"{BASE_URL}/login", json=payload)
    # Assert that the HTTP status code is 200 (OK)
    assert response.status_code == 200
    # Assert that the response message indicates successful login
    assert response.json()["message"] == "Login successful"

# Test Case: Log in with invalid credentials.
def test_login_invalid_user():
    # Define the payload with invalid login credentials
    payload = {
        "username": "invaliduser",
        "password": "wrongpassword"
    }
    # Send a POST request to the /auth/login endpoint
    response = requests.post(f"{BASE_URL}/login", json=payload)
    # Assert that the HTTP status code is 400 (Bad Request)
    assert response.status_code == 400
    # Assert that the response message indicates invalid credentials
    assert response.json()["message"] == "Invalid credentials"