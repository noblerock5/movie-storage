#!/usr/bin/env python3
"""Basic functionality test."""

import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_basic_imports():
    """Test basic imports."""
    try:
        print("Testing FastAPI...")
        import fastapi
        print(f"✅ FastAPI {fastapi.__version__}")
        
        print("Testing SQLAlchemy...")
        import sqlalchemy
        print(f"✅ SQLAlchemy {sqlalchemy.__version__}")
        
        print("Testing Pydantic...")
        import pydantic
        print(f"✅ Pydantic {pydantic.__version__}")
        
        print("Testing Uvicorn...")
        import uvicorn
        print(f"✅ Uvicorn {uvicorn.__version__}")
        
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_simple_app():
    """Test creating a simple FastAPI app."""
    try:
        from fastapi import FastAPI
        
        app = FastAPI(title="Test API")
        
        @app.get("/")
        async def root():
            return {"message": "Hello World"}
        
        print("✅ Simple FastAPI app created successfully")
        return True
    except Exception as e:
        print(f"❌ App creation error: {e}")
        return False

if __name__ == "__main__":
    print("=== Basic Functionality Test ===\n")
    
    if test_basic_imports():
        print("\n=== Testing Simple App ===\n")
        test_simple_app()
        print("\n🎉 All tests passed! The basic setup is working.")
    else:
        print("\n❌ Some tests failed. Check the error messages above.")
        sys.exit(1)