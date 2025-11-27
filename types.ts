export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export enum EducationStage {
  CLASS_10 = 'Class 10',
  CLASS_12 = 'Class 12',
  UNDERGRAD = 'Undergraduate',
  UNSELECTED = 'Unselected'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  stage: EducationStage;
  hasStarted: boolean;
}

export interface CareerPath {
  category: string;
  title: string;
  keywords: string[];
  description: string;
  requirements: string[];
  exams: string[];
  salaryRange: string; // e.g., "8-15 LPA"
}