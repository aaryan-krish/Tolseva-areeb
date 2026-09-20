import { AccuracyClass, CapacityUnit, VerificationIntervalUnit } from '../types';

export interface MachineCatalogEntry {
  id: string;
  manufacturer: string;
  modelDesignation: string;
  category: string;
  friendlyCategory: string; // e.g. "Grocery & Retail Counter Scale"
  accuracyClass: AccuracyClass;
  accuracyClassLabel: string; // friendly plain language, e.g. "Grocery / Retail Scale"
  modelApprovalNumber: string;
  defaultCapacity: number;
  defaultCapacityUnit: CapacityUnit;
  verificationIntervalValue: number;
  verificationIntervalUnit: VerificationIntervalUnit;
  factoryCodePrefix: string;
  modelCode: string;
  popularFor: string;
}

export const POPULAR_MACHINE_CATALOG: MachineCatalogEntry[] = [
  {
    id: 'essae-ds252',
    manufacturer: 'Essae-Teraoka Pvt. Ltd.',
    modelDesignation: 'Essae DS-252',
    category: 'Electronic Counter Scale',
    friendlyCategory: 'Counter Top Grocery & Retail Scale',
    accuracyClass: 'Class III',
    accuracyClassLabel: 'Grocery / Retail Scale (Class III)',
    modelApprovalNumber: 'IND/09/2022/418',
    defaultCapacity: 30,
    defaultCapacityUnit: 'kg',
    verificationIntervalValue: 5,
    verificationIntervalUnit: 'g',
    factoryCodePrefix: 'FAC01',
    modelCode: 'DS252',
    popularFor: 'Kirana, General Stores, Sweet Shops, Supermarkets',
  },
  {
    id: 'essae-ds852',
    manufacturer: 'Essae-Teraoka Pvt. Ltd.',
    modelDesignation: 'Essae DS-852 POS Barcode Scale',
    category: 'Electronic Counter Scale',
    friendlyCategory: 'Retail POS / Barcode Label Printing Scale',
    accuracyClass: 'Class III',
    accuracyClassLabel: 'Retail / Supermarket Scale (Class III)',
    modelApprovalNumber: 'IND/09/2021/309',
    defaultCapacity: 15,
    defaultCapacityUnit: 'kg',
    verificationIntervalValue: 2,
    verificationIntervalUnit: 'g',
    factoryCodePrefix: 'FAC01',
    modelCode: 'DS852',
    popularFor: 'Supermarket Fresh Produce & Bakeries',
  },
  {
    id: 'phoenix-bench-pf100',
    manufacturer: 'Phoenix Scales Pvt. Ltd.',
    modelDesignation: 'Phoenix PF-100 Platform Scale',
    category: 'Platform Scale',
    friendlyCategory: 'Floor / Mandi Platform Scale',
    accuracyClass: 'Class III',
    accuracyClassLabel: 'Wholesale / Mandi Platform Scale (Class III)',
    modelApprovalNumber: 'IND/09/2022/330',
    defaultCapacity: 100,
    defaultCapacityUnit: 'kg',
    verificationIntervalValue: 20,
    verificationIntervalUnit: 'g',
    factoryCodePrefix: 'PHX02',
    modelCode: 'PF100',
    popularFor: 'APMC Mandi, Wholesale Grain & Oil Depots',
  },
  {
    id: 'eagle-precision-gold-600',
    manufacturer: 'Eagle Precision Electronic Balance',
    modelDesignation: 'Eagle EGB-600 Gold Scale',
    category: 'Precision Gold Balance',
    friendlyCategory: 'Jewellery & Gold Karat Balance',
    accuracyClass: 'Class II',
    accuracyClassLabel: 'Jewellery & Gold Scale (High Accuracy Class II)',
    modelApprovalNumber: 'IND/09/2023/215',
    defaultCapacity: 600,
    defaultCapacityUnit: 'g',
    verificationIntervalValue: 10,
    verificationIntervalUnit: 'mg',
    factoryCodePrefix: 'EAG03',
    modelCode: 'EGB600',
    popularFor: 'Gold Jewellers, Precious Gemstones & Bullion',
  },
  {
    id: 'sartorius-micro-bsa',
    manufacturer: 'Sartorius Lab Instruments',
    modelDesignation: 'Sartorius BSA224 Lab Balance',
    category: 'Precision Gold Balance',
    friendlyCategory: 'Micro-analytical Laboratory Balance',
    accuracyClass: 'Class I',
    accuracyClassLabel: 'Pharma / Lab Micro Balance (Special Accuracy Class I)',
    modelApprovalNumber: 'IND/09/2021/102',
    defaultCapacity: 220,
    defaultCapacityUnit: 'g',
    verificationIntervalValue: 1,
    verificationIntervalUnit: 'mg',
    factoryCodePrefix: 'SAR04',
    modelCode: 'BSA224',
    popularFor: 'Pharmacy Testing, Chemical Testing & Research Labs',
  },
  {
    id: 'avery-wb500-weighbridge',
    manufacturer: 'Avery India Limited',
    modelDesignation: 'Avery Weighbridge Truck Scale WB-500',
    category: 'Weighbridge',
    friendlyCategory: 'Heavy Vehicle Truck Weighbridge',
    accuracyClass: 'Class IV',
    accuracyClassLabel: 'Heavy Vehicle Weighbridge / Freight (Class IIII/IV)',
    modelApprovalNumber: 'IND/09/2020/088',
    defaultCapacity: 50,
    defaultCapacityUnit: 't',
    verificationIntervalValue: 20,
    verificationIntervalUnit: 'kg',
    factoryCodePrefix: 'AVY05',
    modelCode: 'WB500',
    popularFor: 'Dharmakanta, Truck Weighing, Logistics Yards & Mining',
  },
  {
    id: 'cas-pr2-retail',
    manufacturer: 'CAS Digital Retail Scale',
    modelDesignation: 'CAS PR-II Commercial Scale',
    category: 'Electronic Counter Scale',
    friendlyCategory: 'Tabletop Vegetable & Meat Scale',
    accuracyClass: 'Class III',
    accuracyClassLabel: 'Grocery / Retail Scale (Class III)',
    modelApprovalNumber: 'IND/09/2023/504',
    defaultCapacity: 30,
    defaultCapacityUnit: 'kg',
    verificationIntervalValue: 5,
    verificationIntervalUnit: 'g',
    factoryCodePrefix: 'CAS06',
    modelCode: 'PRII',
    popularFor: 'Vegetable Markets, Meat & Poultry Counters',
  },
];
