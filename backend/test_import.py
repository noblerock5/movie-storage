#!/usr/bin/env python3
"""Test script to check imports."""

try:
    print("Testing basic imports...")
    import fastapi
    print("✅ FastAPI imported")
    
    import sqlalchemy
    print("✅ SQLAlchemy imported")
    

    
    print("\nTesting app imports...")
    from app.core.config import settings
    print(f"✅ Config loaded, DB URL: {settings.DATABASE_URL}")
    
    from app.core.database import get_db
    print("✅ Database module imported")
    
    from app.main import app
    print("✅ Main app imported successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()