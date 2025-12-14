export type Role = "OPERATOR" | "ADMIN" | "AUDITOR";

export type DocumentCategory =
  | "REGULATION"
  | "MANUAL"
  | "FAQ"
  | "NOTICE"
  | "GUIDELINE";

export type Confidentiality = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL";

export type Feedback = "HELPFUL" | "NOT_HELPFUL";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  departmentId?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  content: string;
  filePath: string;
  version: string;
  confidentiality: Confidentiality;
  isActive: boolean;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  chunkIndex: number;
}

export interface Inquiry {
  id: string;
  userId: string;
  question: string;
  aiResponse?: string;
  sourceDocs?: SourceDocument[];
  feedback?: Feedback;
  responseTimeMs?: number;
  resolved: boolean;
  createdAt: Date;
}

export interface SourceDocument {
  documentId: string;
  documentTitle: string;
  excerpt: string;
  score: number;
}

export interface SearchResult {
  inquiryId: string;
  response: string;
  sources: SourceDocument[];
  responseTimeMs: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceDocument[];
  timestamp: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  target?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
