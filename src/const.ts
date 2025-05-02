import { Admin, DataTemplate, Event } from './types';

const DemographicInformationTemplate: DataTemplate = {
  name: 'Demographic Information',
  fields: [
    {
      type: 'LIST_SINGLE',
      required: true,
      values: ['Male', 'Female'],
      label: 'Gender',
      id: 0
    },
    {
      type: 'STRING',
      required: true,
      label: 'Current location',
      id: 0
    },
    {
      type: 'DATE',
      required: true,
      label: 'Date of Birth',
      id: 0
    },
  ],
};

const OpinionPollTemplate: DataTemplate = {
  name: 'Opinion Poll',
  fields: [
    {
      type: 'BOOLEAN',
      required: true,
      label: 'Do you agree with the ... law?',
      id: 0
    },
  ],
};

const OpinionPoll: Event = {
  admin: {} as Admin,
  type: 'POLLING',
  participants: [],
  analysts: [],
  dataTemplates: [OpinionPollTemplate, DemographicInformationTemplate],
  status: 'UPCOMMING',
};

const SalaryTemplate: DataTemplate = {
  name: 'Salary Benchmark',
  fields: [
    {
      type: 'NUMBER',
      required: true,
      label: 'What is the median salary at your company?',
      id: 0
    },
    {
      type: 'NUMBER',
      required: true,
      label: 'What is the mean salary at your company?',
      id: 0
    },
  ],
};

const BudgetTemplate: DataTemplate = {
  name: 'Salary Benchmark',
  fields: [
    {
      type: 'NUMBER',
      required: true,
      label: 'Specify the R&D budget of your company?',
      id: 0
    },
  ],
};

const CompanyBenchmark: Event = {
  admin: {} as Admin,
  type: 'BENCHMARK',
  participants: [],
  analysts: [],
  dataTemplates: [SalaryTemplate, BudgetTemplate],
  status: 'UPCOMMING',
};
