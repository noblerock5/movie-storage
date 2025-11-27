"""Movie tests."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_movie(
    client: AsyncClient, sample_user_data: dict, sample_movie_data: dict
) -> None:
    """Test movie creation."""
    # Register and login
    await client.post("/api/v1/auth/register", json=sample_user_data)

    login_data = {
        "email": sample_user_data["email"],
        "password": sample_user_data["password"],
    }
    login_response = await client.post("/api/v1/auth/login", json=login_data)
    token = login_response.json()["access_token"]

    # Create movie
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.post(
        "/api/v1/movies/", json=sample_movie_data, headers=headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == sample_movie_data["title"]
    assert data["description"] == sample_movie_data["description"]
    assert data["rating"] == sample_movie_data["rating"]


@pytest.mark.asyncio
async def test_get_movies(client: AsyncClient) -> None:
    """Test getting movies list."""
    response = await client.get("/api/v1/movies/")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_movie_by_id(
    client: AsyncClient, sample_user_data: dict, sample_movie_data: dict
) -> None:
    """Test getting movie by ID."""
    # Register, login, and create movie
    await client.post("/api/v1/auth/register", json=sample_user_data)

    login_data = {
        "email": sample_user_data["email"],
        "password": sample_user_data["password"],
    }
    login_response = await client.post("/api/v1/auth/login", json=login_data)
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    create_response = await client.post(
        "/api/v1/movies/", json=sample_movie_data, headers=headers
    )
    movie_id = create_response.json()["id"]

    # Get movie by ID
    response = await client.get(f"/api/v1/movies/{movie_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == movie_id
    assert data["title"] == sample_movie_data["title"]


@pytest.mark.asyncio
async def test_get_nonexistent_movie(client: AsyncClient) -> None:
    """Test getting non-existent movie."""
    response = await client.get("/api/v1/movies/999999")

    assert response.status_code == 404
    assert "Movie not found" in response.json()["detail"]


@pytest.mark.asyncio
async def test_search_movies(client: AsyncClient) -> None:
    """Test movie search."""
    response = await client.get("/api/v1/movies/search?query=test&page=1")

    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert "total" in data
    assert "page" in data
    assert "query" in data
    assert "has_next" in data
    assert "has_prev" in data


@pytest.mark.asyncio
async def test_update_movie(
    client: AsyncClient, sample_user_data: dict, sample_movie_data: dict
) -> None:
    """Test movie update."""
    # Register, login, and create movie
    await client.post("/api/v1/auth/register", json=sample_user_data)

    login_data = {
        "email": sample_user_data["email"],
        "password": sample_user_data["password"],
    }
    login_response = await client.post("/api/v1/auth/login", json=login_data)
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    create_response = await client.post(
        "/api/v1/movies/", json=sample_movie_data, headers=headers
    )
    movie_id = create_response.json()["id"]

    # Update movie
    update_data = {"title": "Updated Movie Title"}
    response = await client.put(
        f"/api/v1/movies/{movie_id}", json=update_data, headers=headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == update_data["title"]


@pytest.mark.asyncio
async def test_delete_movie(
    client: AsyncClient, sample_user_data: dict, sample_movie_data: dict
) -> None:
    """Test movie deletion."""
    # Register, login, and create movie
    await client.post("/api/v1/auth/register", json=sample_user_data)

    login_data = {
        "email": sample_user_data["email"],
        "password": sample_user_data["password"],
    }
    login_response = await client.post("/api/v1/auth/login", json=login_data)
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    create_response = await client.post(
        "/api/v1/movies/", json=sample_movie_data, headers=headers
    )
    movie_id = create_response.json()["id"]

    # Delete movie
    response = await client.delete(f"/api/v1/movies/{movie_id}", headers=headers)

    assert response.status_code == 200
    assert "Movie deleted successfully" in response.json()["message"]
