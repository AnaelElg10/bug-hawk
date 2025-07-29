import { IsString, IsEnum, IsOptional, IsUUID, IsArray, IsNumber, Min, Max } from 'class-validator';

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REOPENED = 'reopened'
}

export enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  BLOCKER = 'blocker'
}

export enum IssueSeverity {
  TRIVIAL = 'trivial',
  MINOR = 'minor',
  MAJOR = 'major',
  CRITICAL = 'critical',
  BLOCKER = 'blocker'
}

export enum IssueType {
  BUG = 'bug',
  FEATURE = 'feature',
  IMPROVEMENT = 'improvement',
  TASK = 'task',
  STORY = 'story',
  EPIC = 'epic'
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  type: IssueType;
  projectId: string;
  reporterId: string;
  assigneeId?: string;
  tags: string[];
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  environment?: string;
  browserInfo?: string;
  deviceInfo?: string;
  attachments: IssueAttachment[];
  comments: IssueComment[];
  watchers: string[];
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IssueAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface IssueComment {
  id: string;
  content: string;
  authorId: string;
  isInternal: boolean;
  attachments?: IssueAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IssueActivity {
  id: string;
  issueId: string;
  userId: string;
  action: string;
  oldValue?: any;
  newValue?: any;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export class CreateIssueDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(IssueType)
  type: IssueType;

  @IsEnum(IssuePriority)
  priority: IssuePriority;

  @IsEnum(IssueSeverity)
  severity: IssueSeverity;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  stepsToReproduce?: string;

  @IsOptional()
  @IsString()
  expectedBehavior?: string;

  @IsOptional()
  @IsString()
  actualBehavior?: string;

  @IsOptional()
  @IsString()
  environment?: string;

  @IsOptional()
  @IsString()
  browserInfo?: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  @IsOptional()
  dueDate?: Date;
}

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @IsOptional()
  @IsEnum(IssuePriority)
  priority?: IssuePriority;

  @IsOptional()
  @IsEnum(IssueSeverity)
  severity?: IssueSeverity;

  @IsOptional()
  @IsEnum(IssueType)
  type?: IssueType;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  stepsToReproduce?: string;

  @IsOptional()
  @IsString()
  expectedBehavior?: string;

  @IsOptional()
  @IsString()
  actualBehavior?: string;

  @IsOptional()
  @IsString()
  environment?: string;

  @IsOptional()
  @IsString()
  browserInfo?: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  actualHours?: number;

  @IsOptional()
  dueDate?: Date;
}

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  attachmentIds?: string[];

  @IsOptional()
  isInternal?: boolean;
}

export interface IssueFilters {
  status?: IssueStatus[];
  priority?: IssuePriority[];
  severity?: IssueSeverity[];
  type?: IssueType[];
  assigneeId?: string[];
  reporterId?: string[];
  projectId?: string[];
  tags?: string[];
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface IssueSortOptions {
  field: 'createdAt' | 'updatedAt' | 'priority' | 'severity' | 'status' | 'title';
  direction: 'asc' | 'desc';
}

export interface PaginatedIssues {
  issues: Issue[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IssueStats {
  total: number;
  byStatus: Record<IssueStatus, number>;
  byPriority: Record<IssuePriority, number>;
  bySeverity: Record<IssueSeverity, number>;
  byType: Record<IssueType, number>;
  avgResolutionTime: number;
  openIssuesCount: number;
  resolvedIssuesCount: number;
}