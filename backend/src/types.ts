/**
 * Comprehensive TypeScript Type Definitions
 * Math Problem Generator Application
 * 
 * This file contains all type definitions for:
 * - User management
 * - Problem generation and management
 * - Answer validation
 * - API responses
 * - Image analysis
 * - Database queries
 * - Utility types
 */

// ============================================================================
// USER TYPES
// ============================================================================

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  profilePictureUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isEmailVerified: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  difficulty: DifficultyLevel;
  problemTypes: ProblemType[];
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UserProfile extends User {
  totalProblemsGenerated: number;
  totalProblemasSolved: number;
  averageScore: number;
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

export enum ProblemType {
  ARITHMETIC = 'arithmetic',
  ALGEBRA = 'algebra',
  GEOMETRY = 'geometry',
  TRIGONOMETRY = 'trigonometry',
  CALCULUS = 'calculus',
  STATISTICS = 'statistics',
  PROBABILITY = 'probability',
  LINEAR_ALGEBRA = 'linear_algebra',
  WORD_PROBLEM = 'word_problem',
  MIXED = 'mixed',
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export interface ProblemConfig {
  type: ProblemType;
  difficulty: DifficultyLevel;
  quantity: number;
  includeSteps?: boolean;
  includeHints?: boolean;
  allowMultipleChoice?: boolean;
  timeLimit?: number; // in seconds
  customParameters?: Record<string, unknown>;
}

export interface Problem {
  id: string;
  userId: string;
  type: ProblemType;
  difficulty: DifficultyLevel;
  title: string;
  description: string;
  problemStatement: string;
  equation?: string;
  diagram?: string; // SVG or image URL
  hints?: string[];
  steps?: ProblemStep[];
  correctAnswer: Answer;
  alternatives?: Answer[]; // for multiple choice
  topic?: string;
  subTopic?: string;
  tags: string[];
  source?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  metadata?: ProblemMetadata;
}

export interface ProblemStep {
  stepNumber: number;
  description: string;
  operation?: string;
  result?: string;
  explanation?: string;
}

export interface ProblemMetadata {
  estimatedTimeMinutes?: number;
  successRate?: number;
  reportCount?: number;
  views?: number;
  likes?: number;
  skills: string[];
  standards?: string[]; // e.g., Common Core
}

export interface CreateProblemRequest {
  type: ProblemType;
  difficulty: DifficultyLevel;
  title: string;
  description: string;
  problemStatement: string;
  equation?: string;
  correctAnswer: AnswerInput;
  alternatives?: AnswerInput[];
  hints?: string[];
  topic?: string;
  subTopic?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateProblemRequest extends Partial<CreateProblemRequest> {
  diagram?: string;
  steps?: ProblemStep[];
}

export interface ProblemFilter {
  types?: ProblemType[];
  difficulties?: DifficultyLevel[];
  userId?: string;
  isPublic?: boolean;
  tags?: string[];
  topic?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  searchTerm?: string;
}

// ============================================================================
// ANSWER TYPES
// ============================================================================

export enum AnswerFormat {
  TEXT = 'text',
  NUMERIC = 'numeric',
  EQUATION = 'equation',
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_ANSWER = 'short_answer',
  LONG_ANSWER = 'long_answer',
  MATRIX = 'matrix',
  GRAPH = 'graph',
}

export interface Answer {
  id?: string;
  value: string | number | boolean;
  format: AnswerFormat;
  explanation?: string;
  displayFormat?: string;
  unitOfMeasurement?: string;
  tolerance?: number; // for numeric answers
  caseSensitive?: boolean;
}

export interface AnswerInput {
  value: string | number | boolean;
  format: AnswerFormat;
  explanation?: string;
  unitOfMeasurement?: string;
  tolerance?: number;
}

export interface StudentAnswer {
  id: string;
  attemptId: string;
  problemId: string;
  userId: string;
  submittedAnswer: Answer;
  isCorrect: boolean;
  score: number;
  feedback?: string;
  submittedAt: Date;
  timeSpentSeconds?: number;
}

export interface AnswerValidationResult {
  isCorrect: boolean;
  score: number;
  feedback: string;
  explanation?: string;
  correctAnswer: Answer;
  similarAnswers?: Answer[];
  suggestions?: string[];
}

// ============================================================================
// GENERATED PROBLEM TYPES
// ============================================================================

export interface GeneratedProblem extends Problem {
  generatedAt: Date;
  generationMethod: GenerationMethod;
  aiModel?: string;
  seed?: string; // for reproducibility
}

export enum GenerationMethod {
  TEMPLATE_BASED = 'template_based',
  AI_GENERATED = 'ai_generated',
  USER_CREATED = 'user_created',
  IMPORTED = 'imported',
}

export interface GenerationRequest {
  config: ProblemConfig;
  userId: string;
  sessionId?: string;
  preferences?: GenerationPreferences;
}

export interface GenerationPreferences {
  includeRealWorldContext?: boolean;
  includeMultiStepProblems?: boolean;
  emphasizeCommonMistakes?: boolean;
  allowRepetition?: boolean;
  focusAreas?: string[];
}

export interface GenerationResult {
  success: boolean;
  problems: GeneratedProblem[];
  generationTime: number; // milliseconds
  model?: string;
  warnings?: string[];
  errors?: string[];
}

export interface ProblemGenerationHistory {
  id: string;
  userId: string;
  config: ProblemConfig;
  result: GenerationResult;
  createdAt: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Date;
  requestId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// User API Responses
export interface UserResponse extends ApiResponse<User> {}
export interface UserProfileResponse extends ApiResponse<UserProfile> {}
export interface UsersListResponse extends ApiResponse<PaginatedResponse<User>> {}

// Problem API Responses
export interface ProblemResponse extends ApiResponse<Problem> {}
export interface ProblemsListResponse extends ApiResponse<PaginatedResponse<Problem>> {}
export interface GeneratedProblemsResponse extends ApiResponse<GenerationResult> {}

// Answer API Responses
export interface AnswerValidationResponse extends ApiResponse<AnswerValidationResult> {}
export interface StudentAnswerResponse extends ApiResponse<StudentAnswer> {}

// ============================================================================
// IMAGE ANALYSIS TYPES
// ============================================================================

export enum ImageAnalysisType {
  HANDWRITTEN_MATH = 'handwritten_math',
  PRINTED_MATH = 'printed_math',
  GEOMETRIC_DIAGRAM = 'geometric_diagram',
  GRAPH = 'graph',
  GENERAL_DOCUMENT = 'general_document',
}

export interface ImageData {
  id: string;
  url: string;
  base64?: string;
  fileName?: string;
  mimeType: string;
  size: number; // bytes
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ImageAnalysisRequest {
  imageId: string;
  analysisType: ImageAnalysisType;
  extractText?: boolean;
  extractEquations?: boolean;
  extractDiagrams?: boolean;
  language?: string;
}

export interface RecognizedElement {
  type: 'text' | 'equation' | 'diagram' | 'number' | 'symbol' | 'operator';
  value: string;
  confidence: number;
  boundingBox?: BoundingBox;
  position?: Position;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Position {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface ImageAnalysisResult {
  id: string;
  imageId: string;
  analysisType: ImageAnalysisType;
  extractedText?: string;
  recognizedElements: RecognizedElement[];
  equations?: string[];
  problems?: Problem[];
  confidence: number;
  processingTime: number; // milliseconds
  errors?: string[];
  metadata?: ImageAnalysisMetadata;
}

export interface ImageAnalysisMetadata {
  resolution?: string;
  colorSpace?: string;
  quality?: number;
  rotation?: number;
  language?: string;
}

export interface ImageToProblemsRequest {
  imageId: string;
  numberOfProblems?: number;
  difficulty?: DifficultyLevel;
  includeSteps?: boolean;
}

// ============================================================================
// DATABASE QUERY TYPES
// ============================================================================

export interface QueryOptions {
  limit?: number;
  offset?: number;
  skip?: number;
  take?: number;
  sort?: SortOption[];
  select?: string[];
  include?: string[];
  where?: FilterCondition;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterCondition {
  [key: string]: unknown;
  AND?: FilterCondition[];
  OR?: FilterCondition[];
  NOT?: FilterCondition;
}

export interface DatabaseQuery<T> {
  entity: string;
  filters: FilterCondition;
  options: QueryOptions;
  rawQuery?: string; // for raw SQL
}

export interface QueryResult<T> {
  data: T[];
  count: number;
  total: number;
  executionTime: number; // milliseconds
}

export interface Transaction {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'completed' | 'failed' | 'rolled_back';
  operations: DatabaseOperation[];
}

export interface DatabaseOperation {
  id: string;
  type: 'create' | 'read' | 'update' | 'delete';
  entity: string;
  data?: unknown;
  conditions?: FilterCondition;
  timestamp: Date;
}

// ============================================================================
// SESSION & ATTEMPT TYPES
// ============================================================================

export interface SessionData {
  id: string;
  userId: string;
  startedAt: Date;
  expiresAt: Date;
  lastActivityAt: Date;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface ProblemAttempt {
  id: string;
  sessionId: string;
  problemId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: StudentAnswer[];
  totalScore: number;
  isCompleted: boolean;
  timeSpentSeconds?: number;
}

export interface SessionStatistics {
  sessionId: string;
  userId: string;
  totalProblemsAttempted: number;
  problemsCorrect: number;
  problemsIncorrect: number;
  totalScore: number;
  averageScore: number;
  correctPercentage: number;
  totalTimeSpentSeconds: number;
  averageTimePerProblem: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Async<T> = Promise<T>;
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: Date;
  createdAt: Date;
  hits: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================================================
// ENUM TYPES FOR COMMON VALUES
// ============================================================================

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

// ============================================================================
// ADVANCED TYPES
// ============================================================================

export interface MathExpression {
  original: string;
  simplified?: string;
  latex?: string;
  mathml?: string;
  evaluation?: number | string;
}

export interface MathSolution {
  steps: MathStep[];
  finalAnswer: MathExpression;
  method?: string;
  alternativeSolutions?: MathSolution[];
}

export interface MathStep {
  stepNumber: number;
  expression: MathExpression;
  operation: string;
  justification?: string;
  rule?: string; // e.g., "distributive property"
}

export interface GeometricShape {
  type: 'point' | 'line' | 'circle' | 'triangle' | 'rectangle' | 'polygon';
  coordinates?: number[][];
  properties?: Record<string, unknown>;
  area?: number;
  perimeter?: number;
  volume?: number;
}

export interface ProblemGradeRequest {
  attemptId: string;
  problemId: string;
  userId: string;
  submittedAnswer: Answer;
}

export interface ProblemGradeResponse {
  attemptId: string;
  problemId: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  feedback: string;
  detailedAnalysis?: GradeAnalysis;
}

export interface GradeAnalysis {
  conceptsUnderstood: string[];
  conceptsNeedWork: string[];
  commonMistakes: string[];
  suggestions: string[];
  nextSteps: string[];
}

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

/**
 * Type Categories Exported:
 * 
 * 1. USER TYPES: User management, roles, status, preferences
 * 2. PROBLEM TYPES: Problem definition, configuration, filters
 * 3. ANSWER TYPES: Answer formats, validation, student responses
 * 4. GENERATED PROBLEM TYPES: AI/template-based generation
 * 5. API RESPONSE TYPES: Standard response formats, pagination
 * 6. IMAGE ANALYSIS TYPES: Image processing and element recognition
 * 7. DATABASE QUERY TYPES: Query building, filtering, transactions
 * 8. SESSION & ATTEMPT TYPES: User sessions and problem attempts
 * 9. UTILITY TYPES: Helper types, generics, validation
 * 10. ENUM TYPES: Standard enumerations for common values
 * 11. ADVANCED TYPES: Mathematical expressions, geometry, grading
 */
