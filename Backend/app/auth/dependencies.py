from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User

DEV_USER_EMAIL = "dev@local.test"

def _get_or_create_dev_user(db: Session) -> User:
    user = db.query(User).filter(User.email == DEV_USER_EMAIL).first()
    if user is None:
        user = User(
            name="Dev User",
            email=DEV_USER_EMAIL,
            provider="local",
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def get_current_user(db: Session = Depends(get_db)) -> User:
    return _get_or_create_dev_user(db)

def get_current_user_from_query(db: Session = Depends(get_db)) -> User:
    return _get_or_create_dev_user(db)
