from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List
from datetime import datetime
from database import get_db
from models import Task, Project, ProjectMember, User, RoleEnum, StatusEnum
from schemas import TaskCreate, TaskResponse, TaskUpdateStatus, DashboardStats, TaskUpdate
from auth import get_current_user

router = APIRouter(tags=["tasks"])

@router.get("/tasks/", response_model=List[TaskResponse])
def list_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == RoleEnum.ADMIN:
        # Admin sees all tasks in projects they are part of
        project_ids = [m.project_id for m in current_user.memberships]
        tasks = db.query(Task).filter(Task.project_id.in_(project_ids)).all()
    else:
        # Member sees only assigned tasks
        tasks = db.query(Task).filter(Task.assigned_to_id == current_user.id).all()
    
    # Enrich with names
    for t in tasks:
        proj = db.query(Project).filter(Project.id == t.project_id).first()
        t.project_name = proj.name if proj else "Unknown Project"
        
        assigned = db.query(User).filter(User.id == t.assigned_to_id).first()
        t.assigned_to_name = assigned.name if assigned else "Unassigned"
        
        creator = db.query(User).filter(User.id == t.created_by_id).first()
        t.creator_name = creator.name if creator else "Unknown"
        
    return tasks

@router.post("/tasks/", response_model=TaskResponse)
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.email != "admin@gmail.com":
        raise HTTPException(status_code=403, detail="Only admins can create tasks")

    # Check if current user is member of the project
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == task.project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Must be a member of the project to create tasks in it")
    
    new_task = Task(
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        priority=task.priority,
        status=task.status,
        project_id=task.project_id,
        assigned_to_id=task.assigned_to_id,
        created_by_id=current_user.id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Permission check: Only Admin can update all fields
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can edit task details")
        
    for var, value in vars(task_update).items():
        if value is not None:
            setattr(task, var, value)
            
    db.commit()
    db.refresh(task)
    return task

@router.patch("/tasks/{task_id}/status", response_model=TaskResponse)
def update_task_status(task_id: int, status_update: TaskUpdateStatus, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check permissions (assigned user or project admin)
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == task.project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    
    is_project_admin = membership and membership.role == RoleEnum.ADMIN
    is_global_admin = current_user.role == RoleEnum.ADMIN
    is_assigned = task.assigned_to_id == current_user.id
    
    if not (is_project_admin or is_global_admin or is_assigned):
        raise HTTPException(status_code=403, detail="Not authorized to update status")
    
    task.status = status_update.status
    db.commit()
    db.refresh(task)
    return task

@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get all projects the user is part of
    project_ids = [m.project_id for m in current_user.memberships]
    
    # Base query for tasks
    if current_user.role == RoleEnum.ADMIN:
        tasks_query = db.query(Task).filter(Task.project_id.in_(project_ids))
    else:
        tasks_query = db.query(Task).filter(Task.assigned_to_id == current_user.id)
    
    total_tasks = tasks_query.count()
    
    # Status stats
    if current_user.role == RoleEnum.ADMIN:
        status_counts = db.query(Task.status, func.count(Task.id)).filter(
            Task.project_id.in_(project_ids)
        ).group_by(Task.status).all()
    else:
        status_counts = db.query(Task.status, func.count(Task.id)).filter(
            Task.assigned_to_id == current_user.id
        ).group_by(Task.status).all()
        
    tasks_by_status = {s.value: count for s, count in status_counts}
    for s in StatusEnum:
        if s.value not in tasks_by_status:
            tasks_by_status[s.value] = 0
            
    # Overdue tasks
    overdue_tasks = tasks_query.filter(
        Task.due_date < datetime.utcnow(),
        Task.status != StatusEnum.DONE
    ).count()
    
    # Tasks per user (only for admins)
    tasks_per_user = {}
    if current_user.role == RoleEnum.ADMIN:
        user_counts = db.query(User.name, func.count(Task.id)).join(
            Task, User.id == Task.assigned_to_id
        ).filter(
            Task.project_id.in_(project_ids)
        ).group_by(User.name).all()
        tasks_per_user = {name: count for name, count in user_counts}
    else:
        tasks_per_user = {current_user.name: total_tasks}
    
    return {
        "total_tasks": total_tasks,
        "tasks_by_status": tasks_by_status,
        "overdue_tasks": overdue_tasks,
        "tasks_per_user": tasks_per_user
    }
