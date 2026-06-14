import type { AppConfig } from '../types';

export const config: AppConfig = {
  monthlyGoal: 150_000,
  marginFloor: 0.50,
  hiringTriggerPct: 0.85,
  personnelBase: 25_400,
  platformBase: 6_000,
  revisionCap: 2,
  deemedApprovalHours: 96,
  invoicingSyncTarget: 'QuickBooks',
  feesVerifiedAsOf: null,
};
