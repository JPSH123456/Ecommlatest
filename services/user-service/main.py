from prometheus_fastapi_instrumentator import Instrumentator
from fastapi import FastAPI, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import models, schemas
from database import engine, get_db
from security import verify_token

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="User Service")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"service": "User Service", "status": "online"}

@app.get("/profile", response_model=schemas.UserProfileResponse)
def get_profile(request: Request, db: Session = Depends(get_db)):
    user_payload = verify_token(request)
    user_id = user_payload.get("id")
    
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.post("/profile", response_model=schemas.UserProfileResponse)
def update_profile(profile_in: schemas.UserProfileCreate, request: Request, db: Session = Depends(get_db)):
    user_payload = verify_token(request)
    user_id = user_payload.get("id")
    
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    if not profile:
        profile = models.UserProfile(user_id=user_id, **profile_in.model_dump(exclude_unset=True))
        db.add(profile)
    else:
        for key, value in profile_in.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)
            
    db.commit()
    db.refresh(profile)
    return profile

# Expose metrics for Prometheus
Instrumentator().instrument(app).expose(app)
