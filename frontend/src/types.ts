interface User {}

/**
 * Admin creates benchmark or polling system
 */
export interface Admin extends User {}

interface Analyst extends User {}

interface Participant extends User {}

type EventType = 'POLLING' | 'BENCHMARK';
type EventStatus = 'UPCOMMING' | 'UPEN' | 'ANALYSING' | 'FINALIZED';

export interface Event {
  admin: Admin;
  type: EventType;
  participants: Participant[];
  analysts: Analyst[];
  dataTemplates: DataTemplate[];
  status: EventStatus;
  participantThreshold?: number;
  isThresholdMet: boolean;
}

/**
 * This is the data model template for the event
 * A participant fills out such template and an analyst receives output based on an array for such data
 */
export type DataTemplate = {
  name: string;
  fields: DataField[];
};

export type DataField = {
  id: number;
  type:
    | 'LIST_SINGLE'
    | 'LIST_MULTIPLE'
    | 'NUMBER'
    | 'DATE'
    | 'BOOLEAN'
    | 'STRING';
  values?: any[];
  required: boolean;
  label: string;
};

export type DataSubmission = {
  data: any;
  dataField: number;
};
