interface User {}

/**
 * Admin creates benchmark or polling system
 */
export interface Admin extends User {}

interface Analyst extends User {}

interface Participant extends User {}

export type EventType = 'POLL' | 'BENCHMARK';
export type EventStatus = 'PLANNED' | 'LIVE' | 'COMPLETED';
export type FieldType = 'OPTION' | 'BOOLEAN' | 'NUMBER' | 'STRING' | "ADDRESS";

export interface Field {
  name: string;
  description: string;
  type: FieldType;
  values?: {
    value: string | boolean;
    name: string;
  }[];
}

export interface Event {
  eventAddress: string;
  admin: Admin;
  type: EventType;
  participants: Participant[];
  analysts: Analyst[];
  results: {};
  forms: {
    name: string;
    fields: Field[];
  }[];
  emailValidationReqquired?: boolean;
  passportValidationReqquired?: boolean;
  status: EventStatus;
  participantThreshold?: number;
  isThresholdMet: boolean;
}

export type EventListItem = {
  eventType: number;
  eventAddress: string;
  host: string;
  admin: string;
}

/**
 * This is the data model template for the event
 * A participant fills out such template and an analyst receives output based on an array for such data
 */
export type DataTemplate = {
  name: string;
  fields: Field[];
};

export type DataSubmission = {
  data: any;
  dataField: number;
};
