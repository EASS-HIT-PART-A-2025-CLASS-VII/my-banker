import pytest
import requests

# Base URL of the backend server
BASE_URL = "http://localhost:8000/auth"

# Test data
VALID_USER = {
    "username": "admin",
    "password": "admin"
}

INVALID_USER = {
    "username": "invaliduser",
    "password": "wrongpassword"
}

@pytest.fixture
def setup_test_user():
    """
    Fixture to set up a test user in the database.
    This assumes you have an endpoint to create users for testing purposes.
    """
    # Create a test user
    response = requests.post(f"{BASE_URL}/register", json=VALID_USER)
    assert response.status_code == 201  # Ensure the user is created successfully
    yield
    # Clean up the test user
    requests.delete(f"{BASE_URL}/delete", json={"username": VALID_USER["username"]})


def test_login_success(setup_test_user):
    """
    Test successful login with valid credentials.
    """
    response = requests.post(f"{BASE_URL}/login", json=VALID_USER)
    assert response.status_code == 200
    assert response.json()["data"]["type"] == "Success"
    assert response.json()["data"]["message"] == "Login successfuly"


def test_login_invalid_credentials():
    """
    Test login with invalid credentials.
    """
    response = requests.post(f"{BASE_URL}/login", json=INVALID_USER)
    assert response.status_code == 400
    assert response.json()["error"]["type"] == "BadRequest"
    assert response.json()["error"]["message"] == "Invalid credentials"


def test_login_missing_fields():
    """
    Test login with missing fields in the request body.
    """
    response = requests.post(f"{BASE_URL}/login", json={"username": "testuser"})
    assert response.status_code == 400
    assert response.json()["error"]["type"] == "BadRequest"


def test_login_server_error(monkeypatch):
    """
    Test login when a server error occurs.
    """
    def mock_find_one(*args, **kwargs):
        raise Exception("Database error")

    # Mock the database call to simulate a server error
    monkeypatch.setattr("backend.authentication.authenticationModel.User.find_one", mock_find_one)

    response = requests.post(f"{BASE_URL}/login", json=VALID_USER)
    assert response.status_code == 500
    assert response.json()["error"]["type"] == "InternalServerError"
    assert response.json()["error"]["message"] == "Server error"