from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users, projects, tasks

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Team Task Manager API")

# CORS Configuration - MUST BE BEFORE ROUTERS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://alluring-creation-production.up.railway.app",
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost:5175",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)

@app.get("/")
def root():
    return {"message": "Welcome to TTM API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True)
