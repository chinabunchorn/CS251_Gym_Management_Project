from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth import decode_access_token

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload


def require_member(user=Depends(get_current_user)):

    if user["role"] != "member":
        raise HTTPException(
            status_code=403,
            detail="Member access required"
        )

    return user


def require_trainer(user=Depends(get_current_user)):

    if user["role"] != "trainer":
        raise HTTPException(
            status_code=403,
            detail="Trainer access required"
        )

    return user


def require_manager(user=Depends(get_current_user)):

    if user["role"] != "manager":
        raise HTTPException(
            status_code=403,
            detail="Manager access required"
        )

    return user