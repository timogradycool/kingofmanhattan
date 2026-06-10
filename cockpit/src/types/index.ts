// ─── PAY RATE ────────────────────────────────────────────────────────────────

export interface PayRate {
  amount: number;
  unit: 'monthly' | 'hourly' | 'weekly';
}

// ─── TEAM MEMBER ─────────────────────────────────────────────────────────────

export type AppRole = 'Leadership' | 'AccountManager' | 'Team';

export type EmploymentType =
  | 'FTEmployee'
  | 'Founder'
  | 'Contractor'
  | 'PT'
  | 'Freelance'
  | 'ProjectBased';

export type Availability = 'FT' | 'PT' | 'Constrained';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  appRole: AppRole;
  employmentType: EmploymentType | null;       // null = pending
  payRate: PayRate | null;                      // null = pending
  availability: Availability | null;            // null = pending
  contractorToFTDate?: string;                  // ISO date, Vince only
  redlined?: boolean;                           // Austin — known cap
  notes?: string;
}

// ─── CLIENT ──────────────────────────────────────────────────────────────────

export type ClientTier = 'Content' | 'Growth' | 'AOR';

export type ClientStatus = 'active' | 'pending' | 'paused' | 'complete' | 'campaign';

export type ChurnRisk = 'low' | 'medium' | 'high';

export interface Client {
  id: string;
  name: string;
  /** Alias names (e.g. "Chaddy Daddy" for Chad Blankenbiller). */
  aliases?: string[];
  /** Legal entities within one client relationship (e.g. Modern Aesthetic). */
  entities?: string[];
  tier: ClientTier | null;                      // null = pending
  /** Recurring monthly retainer fee. null = pending or not applicable. */
  monthlyFee: number | null;
  /** Campaign or project fee (not recurring). */
  campaignFee?: number;
  /** Remaining campaign budget where applicable. */
  campaignFeeRemaining?: number;
  /** Jan/Feb vintage — all fees flagged until verified at seed time. */
  feeEstimated: boolean;
  accountManagerId: string | null;              // TeamMember.id; null = pending
  productionOwnerIds: string[];                 // TeamMember.id[]
  billingDayOfMonth: number | null;
  /** Monthly ad spend budget managed on behalf of client. */
  adBudget?: number;
  billingPaused: boolean;
  billingPausedReason?: string;
  churnRisk: ChurnRisk | null;
  status: ClientStatus;
  contractEndDate?: string;                     // ISO date
  notes?: string;
}

// ─── DELIVERABLE ─────────────────────────────────────────────────────────────

export type DeliverableType =
  | 'podcast-full'
  | 'clips'
  | 'reels'
  | 'commercial'
  | 'ugc'
  | 'ads'
  | 'statics'
  | 'demo'
  | 'audio';

export type DeliverableStatus =
  | 'pending'
  | 'in-progress'
  | 'revision'
  | 'awaiting-approval'
  | 'deemed-approved'
  | 'approved'
  | 'complete';

export interface Deliverable {
  id: string;
  clientId: string;
  type: DeliverableType;
  assigneeId: string;                           // TeamMember.id
  revisionCap: number;                          // default from AppConfig
  revisionsUsed: number;
  /** For linked deliverables: podcast full-edit must complete before clips start. */
  dependsOnId?: string;                         // Deliverable.id
  status: DeliverableStatus;
  /** ISO datetime when awaiting-approval state began. */
  approvalStartedAt?: string;
  deemedApprovalHours: number;                  // inherits from AppConfig.deemedApprovalHours
}

// ─── SOW ─────────────────────────────────────────────────────────────────────

export type SOWStatus = 'draft' | 'pending' | 'signed' | 'paused';

/**
 * Provisional field set from BUILD BRIEF §4.
 * Reconcile against Fuge SOW template when located.
 */
export interface SOW {
  id: string;
  clientId: string;
  version: string;
  monthlyFee: number;
  deliverables: Array<{ qty: number; cadence: string; type: DeliverableType }>;
  revisionCap: number;
  changeOrderTerms: string;
  signedFileUrl: string | null;
  status: SOWStatus;
  approverId: string | null;                    // TeamMember.id
  signedDate: string | null;                    // ISO date
  notes?: string;
}

// ─── APP CONFIG ──────────────────────────────────────────────────────────────

export interface AppConfig {
  monthlyGoal: number;
  marginFloor: number;
  hiringTriggerPct: number;
  personnelBase: number;
  platformBase: number;
  revisionCap: number;
  /**
   * 96 hours (4 calendar days). Locked by Tim 6/10/2026.
   * Supersedes SOP 5 v1.1 (3 business days). Calendar-based, not business-days.
   * Follow-up: SOP 5 needs v1.2 entry + Matt sign-off.
   */
  deemedApprovalHours: number;
  invoicingSyncTarget: 'QuickBooks';
  /** All client fees are Jan/Feb vintage until verified at seed time. */
  feesVerifiedAsOf: string | null;
}

// ─── SEED BUNDLE ─────────────────────────────────────────────────────────────

export interface SeedBundle {
  config: AppConfig;
  team: TeamMember[];
  clients: Client[];
}
