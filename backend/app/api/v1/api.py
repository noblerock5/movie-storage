"""Main API router."""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.cast import router as cast_router
from app.api.v1.favorites import router as favorites_router
from app.api.v1.movies import router as movies_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(movies_router, prefix="/movies", tags=["movies"])
api_router.include_router(favorites_router, prefix="/favorites", tags=["favorites"])
api_router.include_router(cast_router, prefix="/cast", tags=["casting"])
