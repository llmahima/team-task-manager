from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional, Dict
from enum import Enum

# Import Enums from models to keep them in sync
class RoleEnum(str, Enum):
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"

class PriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class StatusEnum(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: RoleEnum
    created_at: datetime

    class Config:
        from_attributes = True

# Project Member Schemas
class ProjectMemberBase(BaseModel):
    user_id: int
    role: RoleEnum

class ProjectMemberEmail(BaseModel):
    email: EmailStr
    role: RoleEnum

class ProjectMemberResponse(BaseModel):
    id: int
    project_id: int
    user_id: int
    role: RoleEnum
    user: UserResponse

    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: PriorityEnum = PriorityEnum.MEDIUM
    status: StatusEnum = StatusEnum.TODO
    project_id: int
    assigned_to_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None
    assigned_to_id: Optional[int] = None

class TaskUpdateStatus(BaseModel):
    status: StatusEnum

class TaskResponse(TaskBase):
    id: int
    created_by_id: int
    created_at: datetime
    project_name: Optional[str] = None
    assigned_to_name: Optional[str] = None
    creator_name: Optional[str] = None

    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    created_by_id: int
    created_at: datetime
    members: List[ProjectMemberResponse] = []
    my_role: Optional[RoleEnum] = None
    assigned_tasks_count: Optional[int] = 0

    class Config:
        from_attributes = True

class ProjectDetailResponse(ProjectResponse):
    tasks: List[TaskResponse] = []

# Stats Schema
class DashboardStats(BaseModel):
    total_tasks: int
    tasks_by_status: Dict[str, int]
    overdue_tasks: int
    tasks_per_user: Dict[str, int]
