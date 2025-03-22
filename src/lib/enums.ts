export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
}

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

export enum AuthProvider {
  GOOGLE = "google",
  GITHUB = "github",
  CREDENTIALS = "credentials",
}


export enum NotificationType {
  INVITE = "invite",
  WORKSPACE = "workspace",
  MESSAGE = "message",
  ASSIGNMENT = "assignment",
  COMMENT = "comment",
}

export enum MemberStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  IN_REVIEW = "in_review",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum InviteStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}