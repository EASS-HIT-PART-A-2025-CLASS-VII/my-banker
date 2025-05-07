import pytest
import requests

# Base URL of the backend server
BASE_URL = "http://localhost:8000/auth"

# Test data
NEW_USER = {
    "username": "newuser",
    "password": "newpassword"
}

EXISTING_USER = {
    "username": "admin",
    "password": "admin"
}

@pytest.fixture
def setup_existing_user():
    """
    Fixture to set up an existing user in the database.
    This assumes you have an endpoint to create users for testing purposes.
    """
    # Create an existing user
    response = requests.post(f"{BASE_URL}/register", json=EXISTING_USER)
    assert response.status_code == 200  # Ensure the user is created successfully
    yield


def test_register_success():
    """
    Test successful registration of a new user.
    """
    response = requests.post(f"{BASE_URL}/register", json=NEW_USER)
    assert response.status_code == 200
    assert response.json()["data"]["type"] == "Success"
    assert response.json()["data"]["message"] == "User registered successfully"

    # Clean up the newly registered user
    requests.delete(f"{BASE_URL}/delete", json={"username": NEW_USER["username"]})


def test_register_existing_user(setup_existing_user):
    """
    Test registration with an existing username.
    """
    response = requests.post(f"{BASE_URL}/register", json=EXISTING_USER)
    assert response.status_code == 400
    assert response.json()["error"]["type"] == "BadRequest"
    assert response.json()["error"]["message"] == "User already exists"


def test_register_missing_fields():
    """
    Test registration with missing fields in the request body.
    """
    response = requests.post(f"{BASE_URL}/register", json={"username": "newuser"})
    assert response.status_code == 400
    assert response.json()["error"]["type"] == "BadRequest"


def test_register_server_error(monkeypatch):
    """
    Test registration when a server error occurs.
    """
    def mock_save(*args, **kwargs):
        raise Exception("Database error")

    # Mock the save method to simulate a server error
    monkeypatch.setattr("backend.authentication.authenticationModel.User.save", mock_save)

    response = requests.post(f"{BASE_URL}/register", json=NEW_USER)
    assert response.status_code == 500
    assert response.json()["error"]["type"] == "InternalServerError"
    assert response.json()["error"]["message"] == "Server error"