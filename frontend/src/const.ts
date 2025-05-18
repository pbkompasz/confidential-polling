import { Admin, DataTemplate, Event } from './types';

export const ENTRYPOINT_ADDRESS = import.meta.env.VITE_ENTRYPOINT_ADDRESS;
export const VERIFIER_EMAIL = import.meta.env.VITE_ZK_EMAIL_VERIFIER_EMAIL;
export const VERIFIER_URL = import.meta.env.VITE_ZK_EMAIL_VERIFIER_URL;
export const ZK_PASSPORT_VERIFIER_ADDRESS = import.meta.env
  .VITE_ZK_PASSPORT_VERIFIER_ADDRESS;

export const BENCHMARK = 0;
export const POLL = 1;

const DemographicInformationTemplate: DataTemplate = {
  name: 'Demographic Information',
  fields: [
    {
      type: 'OPTION',
      values: [
        {
          value: '0',
          name: 'Male',
        },
        {
          value: '1',
          name: 'Female',
        },
      ],
      description: 'Gender',
      name: '',
    },
    {
      type: 'STRING',
      description: 'Current location',
      name: '',
    },
    {
      description: 'Date of Birth',
      name: '',
      type: 'NUMBER',
    },
  ],
};

const OpinionPollTemplate: DataTemplate = {
  name: 'Opinion Poll',
  fields: [
    {
      name: 'TODO',
      type: 'BOOLEAN',
      description: 'Do you agree with the ... law?',
    },
  ],
};

export const OpinionPoll: Event = {
  address: '',
  admin: {} as Admin,
  type: 'POLL',
  participants: [],
  results: {},
  analysts: [],
  forms: [
    {
      name: 'Generic form',
      fields: [
        ...OpinionPollTemplate.fields,
        ...DemographicInformationTemplate.fields,
      ],
    },
  ],
  status: 'PLANNED',
  isThresholdMet: false,
};

const SalaryTemplate: DataTemplate = {
  name: 'Salary Benchmark',
  fields: [
    {
      type: 'NUMBER',
      description: 'What is the median salary at your company?',
      name: '',
    },
    {
      type: 'NUMBER',
      description: 'What is the mean salary at your company?',
      name: '',
    },
  ],
};

const BudgetTemplate: DataTemplate = {
  name: 'Salary Benchmark',
  fields: [
    {
      type: 'NUMBER',
      description: 'Specify the R&D budget of your company?',
      name: '',
    },
  ],
};

export const CompanyBenchmark: Event = {
  address: '',
  admin: {} as Admin,
  type: 'BENCHMARK',
  participants: [],
  results: {},
  analysts: [],
  forms: [
    {
      name: 'Other form',
      fields: [...SalaryTemplate.fields, ...BudgetTemplate.fields],
    },
  ],
  status: 'PLANNED',
  isThresholdMet: false,
};
