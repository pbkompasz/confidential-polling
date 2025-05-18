interface User {}

/**
 * Admin creates benchmark or polling system
 */
export interface Host extends User {}

interface Analyst extends User {}

interface Participant extends User {}

export type EventType = 'POLL' | 'BENCHMARK';

export type FieldType = 'OPTION' | 'BOOLEAN' | 'NUMBER' | 'STRING' | 'ADDRESS';

export class Status {
  static Planned = 0;
  static Live = 1;
  static Completed = 2;
}

class EncryptedInputType {
  static None = 0;
  static Eaddress = 1;
  static Ebool = 1;
  static Euint64 = 3;
  static Ebytes64 = 4;
  static Choice2 = 5;
  static Choice4 = 6;
  static Choice8 = 7;
}

export class EvaluationType {
  static Eager = 0;
  static Lazy = 1;
  static Ongoing = 2;
}

export class ValidationType {
  static Eager = 0;
  static Lazy = 1;
}

export class StorageType {
  static Onchain = 0;
  static Offchain = 1;
  static Hybrid = 2;
}

// TODO
type Submission = {};

export interface Field {
  name: string;
  encryptedInputType: EncryptedInputType;
  requirementId: number;
  // TODO
  // values?: {
  //   value: string | boolean;
  //   name: string;
  // }[];
}

export interface Event {
  eventAddress: string;
  name: string;
  description: string;
  host: string;
  type: EventType;
  requiresPassportValdation: boolean;
  requiresEmailValdation: boolean;
  status: number;
  participantThreshold?: number;
  isThresholdMet: boolean;
  maximumPariticpants: number;
  evaluationType: EvaluationType;
  validationType: ValidationType;
  storageType: StorageType;
  evaluationBatch: number;
  minSubmissions: number;
  forms?: Form[];
  lastSubmissionEvaluated: number;
}

export type EventListItem = {
  eventType: number;
  eventAddress: string;
  host: string;
  admin: string;
};

export type DataSubmission = {
  data: any;
  dataField: number;
};

export type Form = {
  fields: Field[];
  id: number;
  mainField: number;
};
