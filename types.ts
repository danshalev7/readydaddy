export enum View {
    Dashboard = 'Dashboard',
    Weekly = 'Weekly',
    Labor = 'Labor',
    Profile = 'Profile',
}

export interface UserProfile {
  lmpDate: string;
  dueDate: string;
  partnerName: string;
  babyNickname?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    points: number;
    icon: string;
    criteria: (progress: UserProgress) => boolean;
}

export interface UserProgress {
    readWeeks: number[];
    points: number;
    level: number;
    celebratedMilestones: string[];
}

export interface Contraction {
    startTime: number;
    endTime: number;
    duration: number;
}

export interface Milestone {
    id: string;
    name: string;
    description: string;
    preparationTips: string[];
    week: number;
    category: 'Medical' | 'Preparation' | 'Social';
    fatherSignificance: string;
    emotionalGuidance: string;
    celebrationPrompt: string;
}

export interface MilestoneMemory {
  milestoneId: string;
  note: string;
  date: string;
}

export interface HospitalBagItem {
    id: string;
    name: string;
    category: 'For Partner' | 'For You' | 'For Baby' | 'Documents';
}

export interface DailyMessageWeek {
  week: number;
  daily_messages: string[];
}

// Types for Gemini Service response
export interface BabySize {
    inches: number;
    grams: number;
    comparisonObject: string;
}

export interface FetalSystem {
    name: string;
    status: 'Forming' | 'Developing' | 'Functional';
    fatherFriendlyExplanation: string;
    clinicalSignificance: string;
    whyThisMatters: string;
}

export interface MaternalChange {
    symptom: string;
    timeline: string;
    fatherActionItem: string;
    isWarningSign: boolean;
}

export interface MedicalGuidance {
    topic: string;
    simplifiedExplanation: string;
    detailedExplanation: string;
    fatherAdvocacyScript: string[];
}

export interface PaternalGuidance {
    paternalChanges: string;
    bondingOpportunity: string;
    actionableTasks: string[];
}

export interface WeekData {
    week: number;
    trimester: number;
    babySize: BabySize;
    fetalSystems: FetalSystem[];
    didYouKnowFact: string;
    maternalChanges: MaternalChange[];
    medicalGuidance: MedicalGuidance[];
    warningSigns: string[];
    paternalGuidance: PaternalGuidance;
    error?: string;
}

// Types for services/pregnancyDataService.ts (likely legacy)
export interface FetalDevelopment {
  id: string;
  week: string;
  system_name: string;
  status: 'Forming' | 'Developing' | 'Functional';
  is_critical_window: boolean;
  this_week_summary: string;
  father_understanding_note: string;
}

export interface MaternalChanges {
  week: string;
  symptoms: string[];
  summary: string;
  suggested_action: string;
}

export interface MedicalExplanation {
  topic: string;
  category: string;
  week_range: string;
  simplified_explanation: string;
  related_warning_signs?: {
    warning_signs: string[];
  };
  advocacy_script?: string;
}

export interface WeeklyCard {
  week: number;
  baby_size_comparison: string;
  baby_size_inches: number;
  baby_weight_grams: number;
  did_you_know?: string;
  paternal_changes: string;
  bonding_opportunities: string;
  actionable_tasks: string;
}

export interface AggregatedWeekData {
  week: number;
  fetalDevelopment: FetalDevelopment[];
  maternalChanges: MaternalChanges | null;
  medicalInfo: MedicalExplanation[];
  weeklyCard: WeeklyCard | null;
  hasData: boolean;
  error?: string;
}