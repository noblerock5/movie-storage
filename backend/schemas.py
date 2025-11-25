from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class MovieBase(BaseModel):
    title: str
    description: Optional[str] = ""
    poster_url: Optional[str] = None
    rating: Optional[float] = None
    year: Optional[int] = None
    genre: Optional[str] = None
    duration: Optional[int] = None
    stream_url: Optional[str] = None

class MovieCreate(MovieBase):
    pass

class MovieResponse(MovieBase):
    id: int
    is_local: bool
    user_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class FavoriteResponse(BaseModel):
    id: int
    movie_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class SearchResult(BaseModel):
    title: str
    poster_url: Optional[str] = None
    rating: Optional[float] = None
    year: Optional[int] = None
    genre: Optional[str] = None
    duration: Optional[int] = None
    description: Optional[str] = None
    stream_url: Optional[str] = None
    source: str  # 数据来源