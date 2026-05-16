from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from database import get_db
from models import Project, ProjectMember, User, RoleEnum, Task
from schemas import ProjectCreate, ProjectResponse, ProjectMemberEmail, ProjectMemberResponse, ProjectDetailResponse
from auth import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/", response_model=List[ProjectResponse])
def list_projects(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Projects where user is creator OR exists in project_members
    projects = db.query(Project).join(
        ProjectMember, Project.id == ProjectMember.project_id
    ).filter(
        or_(
            Project.created_by_id == current_user.id,
            ProjectMember.user_id == current_user.id
        )
    ).distinct().all()
    
    # Enrich with my_role and assigned_tasks_count
    for p in projects:
        # Get user's role in this project
        membership = db.query(ProjectMember).filter(
            ProjectMember.project_id == p.id,
            ProjectMember.user_id == current_user.id
        ).first()
        p.my_role = membership.role if membership else None
        
        # Count tasks assigned to this user in this project
        p.assigned_tasks_count = db.query(Task).filter(
            Task.project_id == p.id,
            Task.assigned_to_id == current_user.id
        ).count()
        
    return projects

@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project_details(project_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if user is a member of this project
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this project")
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Map project details
    result = ProjectDetailResponse.from_orm(project)
    
    # Add names to tasks
    for task in result.tasks:
        assigned_user = db.query(User).filter(User.id == task.assigned_to_id).first()
        task.assigned_to_name = assigned_user.name if assigned_user else "Unassigned"
        
        creator_user = db.query(User).filter(User.id == task.created_by_id).first()
        task.creator_name = creator_user.name if creator_user else "Unknown"
        
        task.project_name = project.name
        
    return result

@router.post("/", response_model=ProjectResponse)
def create_project(project: ProjectCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=403, detail="Only global admins can create projects")

    new_project = Project(
        name=project.name,
        description=project.description,
        created_by_id=current_user.id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    # Automatically add creator as Admin
    member = ProjectMember(
        project_id=new_project.id,
        user_id=current_user.id,
        role=RoleEnum.ADMIN
    )
    db.add(member)
    db.commit()
    return new_project

@router.post("/{project_id}/members", response_model=ProjectMemberResponse)
def add_member_by_email(project_id: int, member_data: ProjectMemberEmail, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if current user is admin of the project (or global admin)
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    
    if not (current_user.role == RoleEnum.ADMIN or (membership and membership.role == RoleEnum.ADMIN)):
        raise HTTPException(status_code=403, detail="Only admins can add members")
    
    # Find user by email
    user_to_add = db.query(User).filter(User.email == member_data.email).first()
    if not user_to_add:
        raise HTTPException(status_code=404, detail="User with this email not found")

    # Check if already a member
    existing_member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_to_add.id
    ).first()
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member")

    new_member = ProjectMember(
        project_id=project_id,
        user_id=user_to_add.id,
        role=member_data.role
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

@router.delete("/{project_id}/members/{user_id}")
def remove_member(project_id: int, user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if current user is admin
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    
    if not (current_user.role == RoleEnum.ADMIN or (membership and membership.role == RoleEnum.ADMIN)):
        raise HTTPException(status_code=403, detail="Only admins can remove members")
    
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself from project")
        
    member_to_remove = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()
    
    if not member_to_remove:
        raise HTTPException(status_code=404, detail="Member not found")
    
    db.delete(member_to_remove)
    db.commit()
    return {"message": "Member removed successfully"}
