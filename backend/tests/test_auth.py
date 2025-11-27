"""Authentication tests."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_user(client: AsyncClient, sample_user_data: dict) -> None:
    """Test user registration."""
    response = await client.post("/api/v1/auth/register", json=sample_user_data)

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == sample_user_data["username"]
    assert data["email"] == sample_user_data["email"]
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_register_duplicate_email(
    client: AsyncClient, sample_user_data: dict
) -> None:
    """Test registration with duplicate email."""
    # First registration
    await client.post("/api/v1/auth/register", json=sample_user_data)

    # Second registration with same email
    response = await client.post("/api/v1/auth/register", json=sample_user_data)

    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, sample_user_data: dict) -> None:
    """Test successful login."""
    # Register user first
    await client.post("/api/v1/auth/register", json=sample_user_data)

    # Login
    login_data = {
        "email": sample_user_data["email"],
        "password": sample_user_data["password"],
    }
    response = await client.post("/api/v1/auth/login", json=login_data)

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "expires_in" in data


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient) -> None:
    """Test login with invalid credentials."""
    login_data = {"email": "nonexistent@example.com", "password": "wrongpassword"}
    response = await client.post("/api/v1/auth/login", json=login_data)

    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient, sample_user_data: dict) -> None:
    """Test getting current user info."""
    # Register and login
    await client.post("/api/v1/auth/register", json=sample_user_data)

    login_data = {
        "email": sample_user_data["email"],
        "password": sample_user_data["password"],
    }
    login_response = await client.post("/api/v1/auth/login", json=login_data)
    token = login_response.json()["access_token"]

    # Get current user
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("/api/v1/auth/me", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == sample_user_data["username"]
    assert data["email"] == sample_user_data["email"]


@pytest.mark.asyncio
async def test_get_current_user_unauthorized(client: AsyncClient) -> None:
    """Test getting current user without token."""
    response = await client.get("/api/v1/auth/me")

    assert response.status_code == 401
