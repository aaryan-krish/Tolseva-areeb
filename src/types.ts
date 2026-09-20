export type UserRole = 'vendor' | 'inspector' | 'admin';

export type VendorLanguage = 'en' | 'hi' | 'mr' | 'gu' | 'bn' | 'ta' | 'te' | 'pa';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  identifier: string; // GSTIN / DigiLocker ID / Officer ID
  designation?: string;
  businessName?: string;
  district?: string;
  zone?: string;
  avatarUrl?: string;
}

export interface UserAccount {
  id: string;
  identifier: string; // GSTIN or DigiLocker ID or Officer ID
  passwordHash: string; // Stored user password
  role: UserRole;
  fullName: string;
  email: string;
  mobile: string;
  businessName?: string;
  district?: string;
  createdAt: string;
}

export type AccuracyClass = 'Class I' | 'Class II' | 'Class III' | 'Class IV';

export type CapacityUnit = 'g' | 'kg' | 't';
export type VerificationIntervalUnit = 'mg' | 'g' | 'kg';

export type FlagStatus = 'green' | 'yellow' | 'red';

export type InstrumentStatus = 
  | 'provisional_active'
  | 'inspection_pending'
  | 'verified'
  | 'rejected'
  | 're_audit_assigned';

export interface Instrument {
  id: string;
  serialNumber: string;
  brandModel: string;
  manufacturer?: string;
  modelApprovalNumber?: string;
  maxCapacityValue?: number;
  maxCapacityUnit?: CapacityUnit;
  verificationIntervalValue?: number;
  verificationIntervalUnit?: VerificationIntervalUnit;
  stampedIdentifier?: string;
  category: string; // e.g. Electronic Counter Scale, Weighbridge, Precision Gold Scale
  capacityKg: number;
  accuracyClass: AccuracyClass;
  businessName: string;
  vendorId: string;
  vendorName: string;
  vendorContact: string;
  shopLocation: string;
  district: string;
  state: string;
  pincode: string;
  registeredDate: string;
  provisionalTokenExpiry: string; // 7 days from payment
  feePaid: number;
  paymentId: string;
  status: InstrumentStatus;
  complaintsCount: number;
  flagStatus: FlagStatus;
  lastVerificationDate?: string;
  eCertificateId?: string;
  hologramStickerId?: string;
  qrSecurityHash?: string;
  reAuditReason?: string;
  assignedInspectorId?: string;
  assignedInspectorName?: string;
}

export type ComplaintStatus = 
  | 'Registered' 
  | 'Assigned_To_Inspector' 
  | 'Investigating' 
  | 'Notice_Issued' 
  | 'Inspection_Conducted' 
  | 'Action_Taken' 
  | 'Resolved';

export interface ComplaintTimelineEvent {
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface ConsumerComplaint {
  id: string;
  instrumentId: string;
  businessName: string;
  shopLocation: string;
  consumerName: string;
  consumerMobile: string;
  issueCategory: string;
  commodityName: string;
  billedWeightKg?: number;
  actualWeightKg?: number;
  shortageGrams?: number;
  description: string;
  gpsCoordinates?: { lat: number; lng: number };
  gpsAccuracyMeters?: number;
  locationAddress?: string;
  otpVerified: boolean;
  status: ComplaintStatus;
  createdAt: string;
  assignedInspectorId?: string;
  assignedInspectorName?: string;
  inspectorRemarks?: string;
  hearingDate?: string;
  penaltyImposed?: number;
  timeline?: ComplaintTimelineEvent[];
}

export interface AccuracyTestStep {
  testLoadKg: number;
  observedWeightKg: number;
  errorGm: number;
  maxPermissibleErrorGm: number;
  isPassed: boolean;
}

export interface InspectionSchedule {
  id: string;
  instrumentId: string;
  vendorName: string;
  businessName: string;
  shopLocation: string;
  district: string;
  contact: string;
  category: string;
  serialNumber: string;
  scheduledDate: string;
  scheduledTime: string;
  priority: 'High' | 'Normal' | 'Urgent Re-Audit';
  status: 'Pending' | 'Completed' | 'Delayed';
  distanceKm: number;
  flagStatus: FlagStatus;
  gpsCoordinates: { lat: number; lng: number };
  dueDate?: string; // Target SLA completion deadline
  dueTimestamp?: number; // Epoch timestamp for real-time countdown calculation
  complaintCount?: number; // Linked citizen complaints
  triggeredByComplaint?: boolean; // Triggered by citizen complaints
  assignedInspectorId?: string;
  assignedInspectorName?: string;
}

export type InspectorAttendanceStatus = 'active' | 'on_leave';

export interface InspectorLeaveRecord {
  id: string;
  inspectorId: string;
  inspectorName: string;
  status: InspectorAttendanceStatus;
  leaveReason?: 'Casual Leave' | 'Sick Leave' | 'Official Duty / Court Hearing' | 'Training' | 'Other';
  startDate?: string;
  endDate?: string;
  appliedAt?: string;
  reassignmentNoticeShown?: boolean;
}

export interface VerificationRecord {
  id: string;
  instrumentId: string;
  inspectorId: string;
  inspectorName: string;
  testDate: string;
  testSteps: AccuracyTestStep[];
  overallResult: 'PASS' | 'FAIL';
  hologramStickerId: string;
  eCertificateNo: string;
  validUntil: string;
  inspectorRemarks: string;
}

export interface DisputeTicket {
  id: string;
  instrumentId: string;
  vendorName: string;
  businessName: string;
  subject: string;
  description: string;
  category: 'Calibration Dispute' | 'Inspector Delay' | 'Fee Dispute' | 'Portal Technical Issue';
  status: 'Open' | 'Pending' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
  assignedOfficer?: string;
  resolutionNotes?: string;
}

export interface GpsAuditLog {
  id: string;
  timestamp: string;
  inspectorId: string;
  inspectorName: string;
  action: string;
  location: string;
  district: string;
  geofenceVerified: boolean;
  status: 'Verified' | 'Warning' | 'Mismatch';
}

export interface PenaltyRecord {
  id: string;
  merchantName: string;
  gstin: string;
  district: string;
  violationSection: string;
  penaltyAmount: number;
  date: string;
  status: 'Pending' | 'Paid';
  assignedInspector: string;
}
