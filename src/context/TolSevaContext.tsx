import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  Instrument, 
  InspectionSchedule, 
  DisputeTicket, 
  GpsAuditLog, 
  PenaltyRecord,
  AccuracyTestStep,
  VerificationRecord,
  VendorLanguage,
  ConsumerComplaint,
  ComplaintStatus,
  ComplaintTimelineEvent,
  InspectorAttendanceStatus,
  InspectorLeaveRecord,
  UserAccount
} from '../types';
import { getTranslations, TranslationStrings } from '../utils/translations';
import { 
  DEMO_USERS, 
  INITIAL_INSTRUMENTS, 
  INITIAL_INSPECTIONS, 
  INITIAL_DISPUTES, 
  INITIAL_GPS_LOGS, 
  INITIAL_PENALTIES,
  INITIAL_COMPLAINTS
} from '../data/mockData';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
}

interface TolSevaContextType {
  currentUser: UserProfile | null;
  activeRole: UserRole;
  isAuthenticated: boolean;
  instruments: Instrument[];
  inspections: InspectionSchedule[];
  disputes: DisputeTicket[];
  gpsLogs: GpsAuditLog[];
  penalties: PenaltyRecord[];
  complaints: ConsumerComplaint[];
  notifications: AppNotification[];
  vendorLanguage: VendorLanguage;
  setVendorLanguage: (lang: VendorLanguage) => void;
  t: TranslationStrings;
  login: (role: UserRole, identifier: string) => void;
  loginWithPassword: (role: UserRole, identifier: string, password: string) => { success: boolean; error?: string };
  signUpUser: (accountData: {
    role: UserRole;
    identifier: string;
    password: string;
    fullName: string;
    email: string;
    mobile: string;
    businessName?: string;
    district?: string;
  }) => { success: boolean; error?: string };
  resetPassword: (identifier: string, newPassword: string) => { success: boolean; error?: string };
  getUserAccount: (identifier: string) => UserAccount | undefined;
  quickDemoLogin: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  registerInstrument: (data: {
    category: string;
    brandModel: string;
    serialNumber: string;
    capacityKg: number;
    accuracyClass: Instrument['accuracyClass'];
    businessName: string;
    vendorName: string;
    vendorContact: string;
    shopLocation: string;
    district: string;
    pincode: string;
    feePaid: number;
    paymentId: string;
    manufacturer?: string;
    modelApprovalNumber?: string;
    maxCapacityValue?: number;
    maxCapacityUnit?: Instrument['maxCapacityUnit'];
    verificationIntervalValue?: number;
    verificationIntervalUnit?: Instrument['verificationIntervalUnit'];
    stampedIdentifier?: string;
  }) => Instrument;
  completeAccuracyTest: (
    instrumentId: string, 
    scheduleId: string | null,
    testSteps: AccuracyTestStep[], 
    remarks: string
  ) => VerificationRecord;
  reassignReAudit: (
    instrumentId: string, 
    targetInspectorId: string, 
    targetInspectorName: string, 
    reason: string
  ) => void;
  createDisputeTicket: (ticketData: {
    instrumentId: string;
    subject: string;
    category: DisputeTicket['category'];
    description: string;
    priority: DisputeTicket['priority'];
  }) => DisputeTicket;
  updateTicketStatus: (ticketId: string, status: DisputeTicket['status'], resolutionNotes?: string) => void;
  submitConsumerComplaint: (data: {
    instrumentId: string;
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
  }) => ConsumerComplaint;
  updateComplaintStatus: (
    complaintId: string, 
    status: ComplaintStatus, 
    remarks?: string, 
    hearingDate?: string, 
    penalty?: number
  ) => void;
  addGpsLog: (log: Omit<GpsAuditLog, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  inspectorAttendance: InspectorAttendanceStatus;
  inspectorLeaveRecord: InspectorLeaveRecord | null;
  setInspectorStatus: (status: InspectorAttendanceStatus, leaveDetails?: {
    leaveReason: 'Casual Leave' | 'Sick Leave' | 'Official Duty / Court Hearing' | 'Training' | 'Other';
    startDate: string;
    endDate: string;
  }) => void;
}

const TolSevaContext = createContext<TolSevaContextType | undefined>(undefined);

export const TolSevaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('tolseva_user');
    return savedUser ? JSON.parse(savedUser) : DEMO_USERS.vendor;
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('tolseva_role') as UserRole) || 'vendor';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tolseva_auth') === 'true' || true;
  });

  const [instruments, setInstruments] = useState<Instrument[]>(() => {
    const saved = localStorage.getItem('tolseva_instruments');
    return saved ? JSON.parse(saved) : INITIAL_INSTRUMENTS;
  });

  const [inspections, setInspections] = useState<InspectionSchedule[]>(() => {
    const saved = localStorage.getItem('tolseva_inspections');
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [disputes, setDisputes] = useState<DisputeTicket[]>(() => {
    const saved = localStorage.getItem('tolseva_disputes');
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });

  const [gpsLogs, setGpsLogs] = useState<GpsAuditLog[]>(() => {
    const saved = localStorage.getItem('tolseva_gps_logs');
    return saved ? JSON.parse(saved) : INITIAL_GPS_LOGS;
  });

  const [penalties, setPenalties] = useState<PenaltyRecord[]>(() => {
    const saved = localStorage.getItem('tolseva_penalties');
    return saved ? JSON.parse(saved) : INITIAL_PENALTIES;
  });

  const [complaints, setComplaints] = useState<ConsumerComplaint[]>(() => {
    const saved = localStorage.getItem('tolseva_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [vendorLanguage, setVendorLanguageState] = useState<VendorLanguage>(() => {
    const saved = localStorage.getItem('tolseva_vendor_lang');
    return (saved as VendorLanguage) || 'hi';
  });

  const setVendorLanguage = (lang: VendorLanguage) => {
    setVendorLanguageState(lang);
    localStorage.setItem('tolseva_vendor_lang', lang);
  };

  const t = getTranslations(vendorLanguage);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Provisional Token Issued',
      message: 'Your 7-day provisional token for Scale #ESS-IND-449102 is active. Inspection scheduled.',
      time: '10 min ago',
      type: 'success',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Inspection Assignment',
      message: 'Officer Sunita Patil assigned for physical verification at Santacruz West.',
      time: '1 hour ago',
      type: 'info',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Vigilance Alert',
      message: 'Red-flag status applied on Weighbridge #MET-HEAVY-7721 due to consumer variance.',
      time: '3 hours ago',
      type: 'alert',
      read: false,
    },
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tolseva_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tolseva_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('tolseva_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('tolseva_instruments', JSON.stringify(instruments));
  }, [instruments]);

  useEffect(() => {
    localStorage.setItem('tolseva_inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('tolseva_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('tolseva_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const [inspectorAttendance, setInspectorAttendance] = useState<InspectorAttendanceStatus>(() => {
    const saved = localStorage.getItem('tolseva_inspector_attendance');
    return (saved as InspectorAttendanceStatus) || 'active';
  });

  // User Accounts registry for Persistent Sign Up and Password Authentication
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('tolseva_user_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing tolseva_user_accounts:', e);
      }
    }
    // Default seed accounts matching demo credentials
    return [
      {
        id: 'ACC-VEND-01',
        identifier: '27AABCU9603R1ZM',
        passwordHash: 'Vendor@123',
        role: 'vendor',
        fullName: 'Rajesh Sharma',
        email: 'rajesh.kirana@mumbai-traders.in',
        mobile: '9820123456',
        businessName: 'Sharma Provisions & Daily Mart',
        district: 'Mumbai Suburban',
        createdAt: '2026-01-15T10:00:00.000Z',
      },
      {
        id: 'ACC-INSP-01',
        identifier: 'DL-IND-8849204',
        passwordHash: 'Inspector@123',
        role: 'inspector',
        fullName: 'Officer Sunita Patil',
        email: 'sunita.patil@legalmetrology.gov.in',
        mobile: '9820987654',
        district: 'Mumbai Central & Suburbs',
        createdAt: '2026-01-10T09:00:00.000Z',
      },
      {
        id: 'ACC-ADM-01',
        identifier: 'EMP-GOV-9012',
        passwordHash: 'Admin@123',
        role: 'admin',
        fullName: 'Dr. Amitabh Sen, IAS',
        email: 'amitabh.sen@consumeraffairs.nic.in',
        mobile: '9811001122',
        district: 'State Headquarters (Maharashtra)',
        createdAt: '2026-01-01T08:00:00.000Z',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('tolseva_user_accounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  const [inspectorLeaveRecord, setInspectorLeaveRecord] = useState<InspectorLeaveRecord | null>(() => {
    const saved = localStorage.getItem('tolseva_inspector_leave');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('tolseva_inspector_attendance', inspectorAttendance);
  }, [inspectorAttendance]);

  useEffect(() => {
    localStorage.setItem('tolseva_inspector_leave', JSON.stringify(inspectorLeaveRecord));
  }, [inspectorLeaveRecord]);

  const setInspectorStatus = (status: InspectorAttendanceStatus, leaveDetails?: {
    leaveReason: 'Casual Leave' | 'Sick Leave' | 'Official Duty / Court Hearing' | 'Training' | 'Other';
    startDate: string;
    endDate: string;
  }) => {
    setInspectorAttendance(status);
    if (status === 'on_leave' && leaveDetails) {
      const record: InspectorLeaveRecord = {
        id: `LV-${Date.now()}`,
        inspectorId: currentUser?.id || 'INS-MAH-409',
        inspectorName: currentUser?.name || 'Officer Sunita Patil',
        status: 'on_leave',
        leaveReason: leaveDetails.leaveReason,
        startDate: leaveDetails.startDate,
        endDate: leaveDetails.endDate,
        appliedAt: new Date().toISOString(),
        reassignmentNoticeShown: true,
      };
      setInspectorLeaveRecord(record);

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Leave Applied - Route Reassigned',
          message: `Marked On Leave (${leaveDetails.startDate} to ${leaveDetails.endDate}). All pending visits flagged for Higher Authority Admin re-routing.`,
          time: 'Just now',
          type: 'warning',
          read: false,
        },
        ...prev,
      ]);
    } else {
      setInspectorLeaveRecord(null);
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Inspector Active & On Duty',
          message: 'Status set to Active. Daily route and assignments restored.',
          time: 'Just now',
          type: 'success',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const login = (role: UserRole, identifier: string) => {
    const defaultUser = DEMO_USERS[role];
    const matchedAccount = userAccounts.find(
      a => a.identifier.toLowerCase() === identifier.trim().toLowerCase() && a.role === role
    );

    const user: UserProfile = {
      ...defaultUser,
      id: matchedAccount ? matchedAccount.id : defaultUser.id,
      name: matchedAccount ? matchedAccount.fullName : defaultUser.name,
      email: matchedAccount ? matchedAccount.email : defaultUser.email,
      businessName: matchedAccount?.businessName || defaultUser.businessName,
      district: matchedAccount?.district || defaultUser.district,
      identifier: identifier.trim() || defaultUser.identifier,
    };
    setCurrentUser(user);
    setActiveRole(role);
    setIsAuthenticated(true);
  };

  const loginWithPassword = (role: UserRole, identifier: string, password: string): { success: boolean; error?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const account = userAccounts.find(
      a => a.identifier.toLowerCase() === cleanId && a.role === role
    );

    if (!account) {
      // If user hasn't signed up yet
      return { 
        success: false, 
        error: `No registered account found with ID "${identifier.trim()}". Please Sign Up first or verify your ID.` 
      };
    }

    if (account.passwordHash !== password) {
      return { 
        success: false, 
        error: 'Incorrect password. Please verify your password or use "Forgot Password".' 
      };
    }

    const defaultUser = DEMO_USERS[role];
    const user: UserProfile = {
      ...defaultUser,
      id: account.id,
      name: account.fullName,
      email: account.email,
      businessName: account.businessName || defaultUser.businessName,
      district: account.district || defaultUser.district,
      identifier: account.identifier,
    };

    setCurrentUser(user);
    setActiveRole(role);
    setIsAuthenticated(true);
    return { success: true };
  };

  const signUpUser = (accountData: {
    role: UserRole;
    identifier: string;
    password: string;
    fullName: string;
    email: string;
    mobile: string;
    businessName?: string;
    district?: string;
  }): { success: boolean; error?: string } => {
    const cleanId = accountData.identifier.trim().toUpperCase();
    
    // Check if account already exists
    const existing = userAccounts.find(
      a => a.identifier.toUpperCase() === cleanId && a.role === accountData.role
    );

    if (existing) {
      return {
        success: false,
        error: `An account with ID "${cleanId}" is already registered. Please login with your password or reset it.`
      };
    }

    const newAccount: UserAccount = {
      id: `ACC-${Date.now()}`,
      identifier: cleanId,
      passwordHash: accountData.password,
      role: accountData.role,
      fullName: accountData.fullName.trim(),
      email: accountData.email.trim(),
      mobile: accountData.mobile.trim(),
      businessName: accountData.businessName?.trim(),
      district: accountData.district?.trim() || 'Mumbai Suburban',
      createdAt: new Date().toISOString(),
    };

    setUserAccounts(prev => [newAccount, ...prev]);

    // Automatically log in the freshly created user
    const defaultUser = DEMO_USERS[accountData.role];
    const user: UserProfile = {
      ...defaultUser,
      id: newAccount.id,
      name: newAccount.fullName,
      email: newAccount.email,
      businessName: newAccount.businessName || defaultUser.businessName,
      district: newAccount.district || defaultUser.district,
      identifier: newAccount.identifier,
    };

    setCurrentUser(user);
    setActiveRole(accountData.role);
    setIsAuthenticated(true);

    return { success: true };
  };

  const resetPassword = (identifier: string, newPassword: string): { success: boolean; error?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const accountIndex = userAccounts.findIndex(a => a.identifier.toLowerCase() === cleanId);

    if (accountIndex === -1) {
      return {
        success: false,
        error: `Cannot reset password: No registered account found with ID "${identifier.trim()}".`
      };
    }

    const updated = [...userAccounts];
    updated[accountIndex] = {
      ...updated[accountIndex],
      passwordHash: newPassword,
    };
    setUserAccounts(updated);

    return { success: true };
  };

  const getUserAccount = (identifier: string): UserAccount | undefined => {
    const cleanId = identifier.trim().toLowerCase();
    return userAccounts.find(a => a.identifier.toLowerCase() === cleanId);
  };

  const quickDemoLogin = (role: UserRole) => {
    setCurrentUser(DEMO_USERS[role]);
    setActiveRole(role);
    setIsAuthenticated(true);
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser(DEMO_USERS[role]);
    setActiveRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const registerInstrument = (data: {
    category: string;
    brandModel: string;
    serialNumber: string;
    capacityKg: number;
    accuracyClass: Instrument['accuracyClass'];
    businessName: string;
    vendorName: string;
    vendorContact: string;
    shopLocation: string;
    district: string;
    pincode: string;
    feePaid: number;
    paymentId: string;
    manufacturer?: string;
    modelApprovalNumber?: string;
    maxCapacityValue?: number;
    maxCapacityUnit?: Instrument['maxCapacityUnit'];
    verificationIntervalValue?: number;
    verificationIntervalUnit?: Instrument['verificationIntervalUnit'];
    stampedIdentifier?: string;
  }): Instrument => {
    const dateNow = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(dateNow.getDate() + 7);

    const newInst: Instrument = {
      id: `INST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      serialNumber: data.serialNumber,
      brandModel: data.brandModel,
      manufacturer: data.manufacturer,
      modelApprovalNumber: data.modelApprovalNumber,
      maxCapacityValue: data.maxCapacityValue,
      maxCapacityUnit: data.maxCapacityUnit,
      verificationIntervalValue: data.verificationIntervalValue,
      verificationIntervalUnit: data.verificationIntervalUnit,
      stampedIdentifier: data.stampedIdentifier,
      category: data.category,
      capacityKg: data.capacityKg,
      accuracyClass: data.accuracyClass,
      businessName: data.businessName,
      vendorId: currentUser?.id || 'USR-VEND-108',
      vendorName: data.vendorName,
      vendorContact: data.vendorContact,
      shopLocation: data.shopLocation,
      district: data.district,
      state: 'Maharashtra',
      pincode: data.pincode,
      registeredDate: dateNow.toISOString().split('T')[0],
      provisionalTokenExpiry: expiryDate.toISOString().split('T')[0],
      feePaid: data.feePaid,
      paymentId: data.paymentId,
      status: 'provisional_active',
      complaintsCount: 0,
      flagStatus: 'green',
      qrSecurityHash: `SHA256-TOLSEVA-TOKEN-${Math.floor(100000 + Math.random() * 900000)}`,
      assignedInspectorId: 'INS-MAH-409',
      assignedInspectorName: 'Officer Sunita Patil',
    };

    setInstruments(prev => [newInst, ...prev]);

    // Create a corresponding inspection schedule
    const newSchedule: InspectionSchedule = {
      id: `SCH-2026-${Math.floor(10 + Math.random() * 90)}`,
      instrumentId: newInst.id,
      vendorName: newInst.vendorName,
      businessName: newInst.businessName,
      shopLocation: newInst.shopLocation,
      district: newInst.district,
      contact: newInst.vendorContact,
      category: `${newInst.category} (${newInst.capacityKg} kg)`,
      serialNumber: newInst.serialNumber,
      scheduledDate: 'Upcoming (Within 5 days)',
      scheduledTime: '10:30 AM',
      priority: 'Normal',
      status: 'Pending',
      distanceKm: 3.5,
      flagStatus: 'green',
      gpsCoordinates: { lat: 19.0760, lng: 72.8777 },
    };
    setInspections(prev => [newSchedule, ...prev]);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Instrument Registered',
        message: `${newInst.brandModel} (#${newInst.serialNumber}) registered. Provisional Token generated.`,
        time: 'Just now',
        type: 'success',
        read: false,
      },
      ...prev,
    ]);

    return newInst;
  };

  const completeAccuracyTest = (
    instrumentId: string, 
    scheduleId: string | null,
    testSteps: AccuracyTestStep[], 
    remarks: string
  ): VerificationRecord => {
    const isAllPass = testSteps.every(s => s.isPassed);
    const resultStatus = isAllPass ? 'PASS' : 'FAIL';
    const certNo = `CERT-LM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const stickerId = `HOLO-QR-${Math.floor(100000 + Math.random() * 900000)}`;
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    const record: VerificationRecord = {
      id: `VR-${Date.now()}`,
      instrumentId,
      inspectorId: currentUser?.id || 'INS-MAH-409',
      inspectorName: currentUser?.name || 'Officer Sunita Patil',
      testDate: new Date().toISOString().split('T')[0],
      testSteps,
      overallResult: resultStatus,
      hologramStickerId: stickerId,
      eCertificateNo: certNo,
      validUntil: validUntil.toISOString().split('T')[0],
      inspectorRemarks: remarks,
    };

    // Update instrument status
    setInstruments(prev => prev.map(inst => {
      if (inst.id === instrumentId) {
        return {
          ...inst,
          status: resultStatus === 'PASS' ? 'verified' : 'rejected',
          lastVerificationDate: record.testDate,
          eCertificateId: resultStatus === 'PASS' ? certNo : undefined,
          hologramStickerId: resultStatus === 'PASS' ? stickerId : undefined,
          qrSecurityHash: `SHA256-${stickerId}-GOV-APPROVED`,
        };
      }
      return inst;
    }));

    if (resultStatus === 'PASS') {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Holographic QR Sticker Issued',
          message: `Mandatory holographic QR sticker generated for instrument ${instrumentId}. Affix to scale body for legal trade.`,
          time: 'Just now',
          type: 'success',
          read: false,
        },
        ...prev,
      ]);
    }

    // Update inspection schedule
    if (scheduleId) {
      setInspections(prev => prev.map(sch => {
        if (sch.id === scheduleId) {
          return { ...sch, status: 'Completed' };
        }
        return sch;
      }));
    }

    // Add GPS log
    addGpsLog({
      inspectorId: currentUser?.id || 'INS-MAH-409',
      inspectorName: currentUser?.name || 'Officer Sunita Patil',
      action: `Completed Digital Accuracy Test & e-Cert for ${instrumentId}`,
      location: '19.0843° N, 72.8360° E',
      district: 'Mumbai Suburban',
      geofenceVerified: true,
      status: 'Verified',
    });

    return record;
  };

  const reassignReAudit = (
    instrumentId: string, 
    targetInspectorId: string, 
    targetInspectorName: string, 
    reason: string
  ) => {
    setInstruments(prev => prev.map(inst => {
      if (inst.id === instrumentId) {
        return {
          ...inst,
          status: 're_audit_assigned',
          assignedInspectorId: targetInspectorId,
          assignedInspectorName: targetInspectorName,
          reAuditReason: reason,
        };
      }
      return inst;
    }));

    // Update or add high priority schedule
    const inst = instruments.find(i => i.id === instrumentId);
    if (inst) {
      const urgentSchedule: InspectionSchedule = {
        id: `SCH-URG-${Date.now()}`,
        instrumentId,
        vendorName: inst.vendorName,
        businessName: inst.businessName,
        shopLocation: inst.shopLocation,
        district: inst.district,
        contact: inst.vendorContact,
        category: `${inst.category} (${inst.capacityKg} kg)`,
        serialNumber: inst.serialNumber,
        scheduledDate: 'Immediate Priority',
        scheduledTime: 'Within 24 Hours',
        priority: 'Urgent Re-Audit',
        status: 'Pending',
        distanceKm: 12.0,
        flagStatus: inst.flagStatus,
        gpsCoordinates: { lat: 19.0760, lng: 72.8777 },
      };
      setInspections(prev => [urgentSchedule, ...prev]);
    }

    // Add GPS audit log
    addGpsLog({
      inspectorId: currentUser?.id || 'ADM-DIR-002',
      inspectorName: currentUser?.name || 'Directorate Desk',
      action: `Independent Re-Audit Dispatched for ${instrumentId} -> ${targetInspectorName}`,
      location: 'Apex Directorate HQ',
      district: 'State Metrology Control',
      geofenceVerified: true,
      status: 'Verified',
    });

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Re-Audit Assigned by Directorate',
        message: `High-priority audit order dispatched for instrument ${instrumentId} to ${targetInspectorName}.`,
        time: 'Just now',
        type: 'alert',
        read: false,
      },
      ...prev,
    ]);
  };

  const createDisputeTicket = (ticketData: {
    instrumentId: string;
    subject: string;
    category: DisputeTicket['category'];
    description: string;
    priority: DisputeTicket['priority'];
  }): DisputeTicket => {
    const inst = instruments.find(i => i.id === ticketData.instrumentId);
    const newTicket: DisputeTicket = {
      id: `TKT-2026-${Math.floor(200 + Math.random() * 800)}`,
      instrumentId: ticketData.instrumentId,
      vendorName: currentUser?.name || 'Rajesh Sharma',
      businessName: currentUser?.businessName || inst?.businessName || 'Trader Co.',
      subject: ticketData.subject,
      description: ticketData.description,
      category: ticketData.category,
      status: 'Open',
      priority: ticketData.priority,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      assignedOfficer: inst?.assignedInspectorName || 'Officer Sunita Patil',
    };

    setDisputes(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: DisputeTicket['status'], resolutionNotes?: string) => {
    setDisputes(prev => prev.map(tkt => {
      if (tkt.id === ticketId) {
        return {
          ...tkt,
          status,
          updatedAt: 'Just now',
          resolutionNotes: resolutionNotes || tkt.resolutionNotes,
        };
      }
      return tkt;
    }));
  };

  const addGpsLog = (log: Omit<GpsAuditLog, 'id' | 'timestamp'>) => {
    const newLog: GpsAuditLog = {
      ...log,
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
    };
    setGpsLogs(prev => [newLog, ...prev]);
  };

  const submitConsumerComplaint = (data: {
    instrumentId: string;
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
  }): ConsumerComplaint => {
    const targetInst = instruments.find(i => i.id === data.instrumentId);
    const assignedInspectorId = targetInst?.assignedInspectorId || 'INS-MAH-409';
    const assignedInspectorName = targetInst?.assignedInspectorName || 'Officer Sunita Patil';
    const complaintId = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialTimeline: ComplaintTimelineEvent[] = [
      {
        status: 'Registered',
        title: 'Complaint Lodged via Public Scale QR Code',
        description: `Citizen verified mobile OTP. Reported ${data.issueCategory} on ${data.commodityName}${data.shortageGrams ? ' with ' + data.shortageGrams + 'g shortage' : ''}.`,
        timestamp: 'Just now',
        actor: 'Citizen QR Portal',
      },
      {
        status: 'Assigned_To_Inspector',
        title: `Directly Dispatched to ${assignedInspectorName}`,
        description: `Case directly assigned to Jurisdictional Inspector (${assignedInspectorId}) for mandatory field verification under Sec. 29.`,
        timestamp: 'Just now',
        actor: 'TolSeva Dispatcher',
      },
    ];

    const newComplaint: ConsumerComplaint = {
      id: complaintId,
      instrumentId: data.instrumentId,
      businessName: targetInst?.businessName || 'Commercial Establishment',
      shopLocation: targetInst?.shopLocation || 'Counter Location',
      consumerName: data.consumerName.trim() || 'Verified Citizen Consumer',
      consumerMobile: data.consumerMobile,
      issueCategory: data.issueCategory,
      commodityName: data.commodityName,
      billedWeightKg: data.billedWeightKg,
      actualWeightKg: data.actualWeightKg,
      shortageGrams: data.shortageGrams,
      description: data.description,
      gpsCoordinates: data.gpsCoordinates || { lat: 19.0760, lng: 72.8777 },
      gpsAccuracyMeters: data.gpsAccuracyMeters || 8,
      locationAddress: data.locationAddress || targetInst?.shopLocation || 'Registered Counter Location',
      otpVerified: true,
      status: 'Assigned_To_Inspector',
      createdAt: 'Just now',
      assignedInspectorId,
      assignedInspectorName,
      timeline: initialTimeline,
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Directly create high-priority investigation task in Inspector's task list
    const complaintInspection: InspectionSchedule = {
      id: `SCH-GRV-${Date.now()}`,
      instrumentId: data.instrumentId,
      vendorName: targetInst?.vendorName || 'Merchant',
      businessName: targetInst?.businessName || 'Trader Establishment',
      shopLocation: targetInst?.shopLocation || 'Counter Location',
      district: targetInst?.district || 'Mumbai Suburban',
      contact: targetInst?.vendorContact || data.consumerMobile,
      category: `[Public Complaint] ${data.issueCategory}`,
      serialNumber: targetInst?.serialNumber || 'SN-SCALE',
      scheduledDate: 'Immediate Priority Raid',
      scheduledTime: 'Within 24 Hours',
      priority: 'Urgent Re-Audit',
      status: 'Pending',
      distanceKm: 2.8,
      flagStatus: 'red',
      gpsCoordinates: data.gpsCoordinates || { lat: 19.0760, lng: 72.8777 },
    };
    setInspections(prev => [complaintInspection, ...prev]);

    // Update target instrument: increment complaintsCount and update flag
    setInstruments(prev => prev.map(inst => {
      if (inst.id === data.instrumentId) {
        const updatedCount = (inst.complaintsCount || 0) + 1;
        let newFlag = inst.flagStatus;
        if (updatedCount >= 3) {
          newFlag = 'red';
        } else if (updatedCount >= 1) {
          newFlag = 'yellow';
        }
        return {
          ...inst,
          complaintsCount: updatedCount,
          flagStatus: newFlag,
        };
      }
      return inst;
    }));

    // Auto-create Dispute/Vigilance ticket
    const newTicket: DisputeTicket = {
      id: `TKT-${complaintId}`,
      instrumentId: data.instrumentId,
      vendorName: targetInst?.vendorName || 'Merchant',
      businessName: targetInst?.businessName || 'Trader Establishment',
      subject: `[Direct Citizen Grievance] ${data.issueCategory}`,
      description: `Reported by ${data.consumerName} (${data.consumerMobile}). Commodity: ${data.commodityName}. Shortage: ${data.shortageGrams ? data.shortageGrams + 'g' : 'N/A'}. Location: ${data.locationAddress || 'Verified on-site'}`,
      category: 'Calibration Dispute',
      status: 'Open',
      priority: 'High',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      assignedOfficer: assignedInspectorName,
    };
    setDisputes(prev => [newTicket, ...prev]);

    // Add immediate high-priority inspector notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Direct Citizen Complaint Dispatched (${complaintId})`,
        message: `${data.issueCategory} filed by ${data.consumerName} against ${targetInst?.businessName} (${data.instrumentId}). Direct investigation task scheduled.`,
        time: 'Just now',
        type: 'alert',
        read: false,
      },
      ...prev,
    ]);

    return newComplaint;
  };

  const updateComplaintStatus = (
    complaintId: string, 
    status: ComplaintStatus, 
    remarks?: string, 
    hearingDate?: string, 
    penalty?: number
  ) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const newEvent: ComplaintTimelineEvent = {
          status,
          title: status === 'Investigating' ? 'Inspector Investigation Underway'
            : status === 'Notice_Issued' ? 'Statutory Show-Cause Notice Issued (Sec. 29)'
            : status === 'Inspection_Conducted' ? 'On-Site Field Audit Conducted'
            : status === 'Action_Taken' ? 'Penalties & Rectification Order Enacted'
            : status === 'Resolved' ? 'Grievance Resolved & Redressal Confirmed'
            : 'Complaint Status Updated',
          description: remarks || `Action updated by ${currentUser?.name || c.assignedInspectorName || 'Legal Metrology Officer'}`,
          timestamp: 'Just now',
          actor: currentUser?.name || c.assignedInspectorName || 'Legal Metrology Officer',
        };

        return {
          ...c,
          status,
          inspectorRemarks: remarks !== undefined ? remarks : c.inspectorRemarks,
          hearingDate: hearingDate !== undefined ? hearingDate : c.hearingDate,
          penaltyImposed: penalty !== undefined ? penalty : c.penaltyImposed,
          timeline: [...(c.timeline || []), newEvent],
        };
      }
      return c;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Complaint ${complaintId} Updated`,
        message: `Status updated to ${status.replace(/_/g, ' ')}. Remarks recorded.`,
        time: 'Just now',
        type: status === 'Resolved' ? 'success' : 'info',
        read: false,
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <TolSevaContext.Provider
      value={{
        currentUser,
        activeRole,
        isAuthenticated,
        instruments,
        inspections,
        disputes,
        gpsLogs,
        penalties,
        complaints,
        notifications,
        vendorLanguage,
        setVendorLanguage,
        t,
        login,
        loginWithPassword,
        signUpUser,
        resetPassword,
        getUserAccount,
        quickDemoLogin,
        switchRole,
        logout,
        registerInstrument,
        completeAccuracyTest,
        reassignReAudit,
        createDisputeTicket,
        updateTicketStatus,
        submitConsumerComplaint,
        updateComplaintStatus,
        addGpsLog,
        markNotificationRead,
        clearNotifications,
        inspectorAttendance,
        inspectorLeaveRecord,
        setInspectorStatus,
      }}
    >
      {children}
    </TolSevaContext.Provider>
  );
};

export const useTolSeva = () => {
  const context = useContext(TolSevaContext);
  if (!context) {
    throw new Error('useTolSeva must be used within a TolSevaProvider');
  }
  return context;
};
