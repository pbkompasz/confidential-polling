export const entrypointAbi = [
  {
    inputs: [],
    name: 'getIdentityRegistryAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEvents',
    outputs: [
      {
        components: [
          { internalType: 'uint8', name: 'eventType', type: 'uint8' },
          { internalType: 'address', name: 'eventAddress', type: 'address' },
          { internalType: 'address', name: 'host', type: 'address' },
          { internalType: 'address', name: 'admin', type: 'address' },
        ],
        internalType: 'struct YourContract._Event[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEventsLength',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_description',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_maximumParticpants',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_evaulationBatch',
        type: 'uint8',
      },
      {
        internalType: 'IEvent.EvaluationType',
        name: '_evaluationType',
        type: 'uint8',
      },
      {
        internalType: 'IEvent.ValidationType',
        name: '_validationType',
        type: 'uint8',
      },
      {
        internalType: 'IEvent.StorageType',
        name: '_storageType',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: '_minSubmissions',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_requirePassportValidation',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_requireEmailValidation',
        type: 'bool',
      },
    ],
    name: 'createPoll',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const eventAbi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'formId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'dataHash',
        type: 'uint256',
      },
    ],
    name: 'submitDataOffchain',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'formId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'dataHash',
        type: 'bytes32',
      },
      {
        components: [
          {
            internalType: 'bytes32[]',
            name: 'inputs',
            type: 'bytes32[]',
          },
          {
            internalType: 'bytes',
            name: 'inputProof',
            type: 'bytes',
          },
        ],
        internalType: 'struct FormData',
        name: 'formData',
        type: 'tuple',
      },
    ],
    name: 'submitDataOnchain',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stopEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDetailsFull',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'address', name: 'host', type: 'address' },
          {
            internalType: 'uint256',
            name: 'maximumParticipants',
            type: 'uint256',
          },
          {
            internalType: 'enum EvaluationType',
            name: 'evaluationType',
            type: 'uint8',
          },
          {
            internalType: 'enum ValidationType',
            name: 'validationType',
            type: 'uint8',
          },
          {
            internalType: 'enum StorageType',
            name: 'storageType',
            type: 'uint8',
          },
          { internalType: 'uint256', name: 'evaluationBatch', type: 'uint256' },
          { internalType: 'uint256', name: 'minSubmissions', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'lastSubmissionEvaluated',
            type: 'uint256',
          },
          { internalType: 'string', name: 'eventType', type: 'string' },
          {
            internalType: 'bool',
            name: 'requiresEmailValdation',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'requiresPassportValdation',
            type: 'bool',
          },
          { internalType: 'enum Status', name: 'status', type: 'uint8' },
          {
            internalType: 'uint256',
            name: 'participationThreshold',
            type: 'uint256',
          },
          { internalType: 'bool', name: 'isThresholdMet', type: 'bool' },
          { internalType: 'address', name: 'eventAddress', type: 'address' },
        ],
        internalType: 'struct EventDetails',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getForms',
    outputs: [
      {
        internalType: 'struct Form[]',
        name: '',
        type: 'tuple[]',
        components: [
          {
            internalType: 'struct Field[]',
            name: 'fields',
            type: 'tuple[]',
            components: [
              { internalType: 'string', name: 'name', type: 'string' },
              {
                internalType: 'enum EncryptedInputType',
                name: 'encryptedInputType',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'requirementId',
                type: 'uint256',
              },
              { internalType: 'string[]', name: 'values', type: 'string[]' },
            ],
          },
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'uint256', name: 'mainField', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
    ],
    name: 'getEventUserRole',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDetails',
    outputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'enum Status',
        name: '',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'eventType',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'noParticipants',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'encryptedInputType',
            type: 'uint8',
          },
          {
            name: 'requirementId',
            type: 'uint256',
          },
        ],
        name: 'fields',
        type: 'tuple[]',
      },
    ],
    name: 'createForm',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const identityAbi = [
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'signUp',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
