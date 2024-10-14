export enum ERROR_MSG_TYPE {
  SYSTEM = 'system'
}

export enum ADMIN_ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export const USER_ROLE = {
  OWNER: 'OWNER'
}

export enum REPORT_STATUS {
  WAITING = 'WAITING',
  RE_OPEN = 'RE_OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED'
}

export enum ORGANIZATION_ROLE {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export enum REPORT_TYPE {
  NORMAL = 'NORMAL',
  EVENT = 'EVENT'
}

export enum REPORT_APPROVAL_STATUS {
  WAITING = 'WAITING',
  APPROVED = 'APPROVED'
}
