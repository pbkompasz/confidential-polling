import { Status } from "./types";

export const ENTRYPOINT_ADDRESS = import.meta.env.VITE_ENTRYPOINT_ADDRESS;
export const VERIFIER_EMAIL = import.meta.env.VITE_ZK_EMAIL_VERIFIER_EMAIL;
export const VERIFIER_URL = import.meta.env.VITE_ZK_EMAIL_VERIFIER_URL;
export const ZK_PASSPORT_VERIFIER_ADDRESS = import.meta.env
  .VITE_ZK_PASSPORT_VERIFIER_ADDRESS;

export const BENCHMARK = 0;
export const POLL = 1;

export const demoAccounts = [
  {
    address: '0x3500438F95D4CCc2e6cd00ab2EbC4ed979D8218c',
    privateKey:
      '0x54b873583b06adad015e9e3f6496011ad62aa6330728bbcedea2a1f17fdb396b',
    name: 'Alice',
    isAdmin: true,
  },
  {
    address: '0x9EBA6Aa76418E8A560E7E0002670C54B5d8a8790',
    privateKey:
      '0x5208b7e6153189c2d50d8eb57db7a99f0248153c1e04164e6b5fc54fafa7ddba',
    name: 'Bob',
  },
  {
    address: '0x8Fb434616E5DCb006653DaB81DB5b427A412458a',
    privateKey:
      '0xfb6e299fc78a41ed1a1492fd04660e960361e33e594f4da5ed6fb266ce1cd2a5',
    name: 'Carol',
  },
];

const DemographicInformationTemplate = {
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

const OpinionPollTemplate = {
  name: 'Opinion Poll',
  fields: [
    {
      name: 'TODO',
      type: 'BOOLEAN',
      description: 'Do you agree with the ... law?',
    },
  ],
};

export const OpinionPoll = {
  address: '',
  admin: '',
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
  status: Status.Live,
  isThresholdMet: false,
};

const SalaryTemplate = {
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

const BudgetTemplate = {
  name: 'Salary Benchmark',
  fields: [
    {
      type: 'NUMBER',
      description: 'Specify the R&D budget of your company?',
      name: '',
    },
  ],
};

export const CompanyBenchmark = {
  address: '',
  admin: '',
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
  status: Status.Planned,
  isThresholdMet: false,
};
