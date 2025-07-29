import { IsString, IsOptional, IsUUID, IsArray, IsEnum, IsUrl } from 'class-validator';
import { UserRole } from './user.types';

export enum ProjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  ON_HOLD = 'on_hold'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  key: string; // Short identifier like "BH", "PROJ"
  status: ProjectStatus;
  ownerId: string;
  members: ProjectMember[];
  settings: ProjectSettings;
  metadata: ProjectMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  userId: string;
  role: ProjectRole;
  permissions: ProjectPermission[];
  joinedAt: Date;
}

export enum ProjectRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  QA = 'qa',
  VIEWER = 'viewer'
}

export enum ProjectPermission {
  CREATE_ISSUE = 'create_issue',
  EDIT_ISSUE = 'edit_issue',
  DELETE_ISSUE = 'delete_issue',
  ASSIGN_ISSUE = 'assign_issue',
  RESOLVE_ISSUE = 'resolve_issue',
  MANAGE_MEMBERS = 'manage_members',
  MANAGE_PROJECT = 'manage_project',
  VIEW_REPORTS = 'view_reports',
  MANAGE_SETTINGS = 'manage_settings'
}

export interface ProjectSettings {
  isPublic: boolean;
  allowGuestComments: boolean;
  requireApprovalForMembers: boolean;
  enableNotifications: boolean;
  integrations: {
    slack?: {
      webhookUrl: string;
      channel: string;
      enabled: boolean;
    };
    github?: {
      repository: string;
      token: string;
      enabled: boolean;
    };
    gitlab?: {
      projectId: string;
      token: string;
      enabled: boolean;
    };
  };
  workflow: {
    statusFlow: string[];
    autoAssignment: boolean;
    requireEstimates: boolean;
  };
}

export interface ProjectMetadata {
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  memberCount: number;
  lastActivity: Date;
  tags: string[];
  categories: string[];
}

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  key: string;

  @IsOptional()
  settings?: Partial<ProjectSettings>;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  settings?: Partial<ProjectSettings>;
}

export class AddProjectMemberDto {
  @IsUUID()
  userId: string;

  @IsEnum(ProjectRole)
  role: ProjectRole;

  @IsOptional()
  @IsArray()
  @IsEnum(ProjectPermission, { each: true })
  permissions?: ProjectPermission[];
}

export class UpdateProjectMemberDto {
  @IsOptional()
  @IsEnum(ProjectRole)
  role?: ProjectRole;

  @IsOptional()
  @IsArray()
  @IsEnum(ProjectPermission, { each: true })
  permissions?: ProjectPermission[];
}

export interface ProjectInvitation {
  id: string;
  projectId: string;
  email: string;
  role: ProjectRole;
  permissions: ProjectPermission[];
  invitedBy: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

export class InviteProjectMemberDto {
  @IsString()
  email: string;

  @IsEnum(ProjectRole)
  role: ProjectRole;

  @IsOptional()
  @IsArray()
  @IsEnum(ProjectPermission, { each: true })
  permissions?: ProjectPermission[];
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  ownerId?: string;
  memberId?: string;
  search?: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  totalIssues: number;
  avgIssuesPerProject: number;
  projectsByStatus: Record<ProjectStatus, number>;
}

export const DEFAULT_PROJECT_PERMISSIONS: Record<ProjectRole, ProjectPermission[]> = {
  [ProjectRole.OWNER]: [
    ProjectPermission.CREATE_ISSUE,
    ProjectPermission.EDIT_ISSUE,
    ProjectPermission.DELETE_ISSUE,
    ProjectPermission.ASSIGN_ISSUE,
    ProjectPermission.RESOLVE_ISSUE,
    ProjectPermission.MANAGE_MEMBERS,
    ProjectPermission.MANAGE_PROJECT,
    ProjectPermission.VIEW_REPORTS,
    ProjectPermission.MANAGE_SETTINGS
  ],
  [ProjectRole.ADMIN]: [
    ProjectPermission.CREATE_ISSUE,
    ProjectPermission.EDIT_ISSUE,
    ProjectPermission.DELETE_ISSUE,
    ProjectPermission.ASSIGN_ISSUE,
    ProjectPermission.RESOLVE_ISSUE,
    ProjectPermission.MANAGE_MEMBERS,
    ProjectPermission.VIEW_REPORTS
  ],
  [ProjectRole.DEVELOPER]: [
    ProjectPermission.CREATE_ISSUE,
    ProjectPermission.EDIT_ISSUE,
    ProjectPermission.ASSIGN_ISSUE,
    ProjectPermission.RESOLVE_ISSUE
  ],
  [ProjectRole.QA]: [
    ProjectPermission.CREATE_ISSUE,
    ProjectPermission.EDIT_ISSUE,
    ProjectPermission.ASSIGN_ISSUE
  ],
  [ProjectRole.VIEWER]: []
};