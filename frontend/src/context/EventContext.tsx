import { BENCHMARK, ENTRYPOINT_ADDRESS, POLL } from '@/const';
import { BrowserProvider, ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event, EventListItem } from '../types';
import useAccount from '../hooks/useAccount';
import { FormSchema } from '@/components/Home';
import { z } from 'zod';

type ThemeContextType = {
  selectedEvent?: Event;
  selectEvent: any;
  selectedPoll?: Event;
  selectedBenchmark?: Event;
  events: EventListItem[];
  polls: EventListItem[];
  benchmarks: EventListItem[];
  startEvent: () => {};
  editEvent: () => void;
  stopEvent: () => {};
  cancelEvent: () => {};
  getEvents: () => Promise<any>;
  viewResults: () => void;
  submitForm: () => {};
  createEvent: (data: z.infer<typeof FormSchema>) => Promise<void>;
  createForm: (
    eventAddress: string,
    data: z.infer<typeof FormSchema>,
  ) => Promise<void>;
};

export const EventContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const EventProvider = ({ children }: { children: any }) => {
  const navigate = useNavigate();
  const { signer } = useAccount();

  const provider = new ethers.JsonRpcProvider('http://localhost:8545');

  const contractAddress = ENTRYPOINT_ADDRESS;
  const entrypointAbi = [
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

  const eventAbi = [
    {
      inputs: [],
      name: 'getForms',
      outputs: [
        {
          components: [
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
          name: '',
          type: 'tuple[]',
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
          name: '',
          type: 'bool',
        },
        {
          name: '',
          type: 'bool',
        },
        {
          name: '',
          type: 'uint8',
        },
        {
          name: '',
          type: 'uint8',
        },
        {
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

  const [benchmarks, setBenchmarks] = useState<EventListItem[]>([]);
  const [polls, setPolls] = useState<EventListItem[]>([]);
  const [events, setEvents] = useState<EventListItem[]>([
    {
      eventAddress: '0x26BfbD8ED2B302ec2c2B6f063C4caF7abcB062e0',
      admin: '0x26BfbD8ED2B302ec2c2B6f063C4caF7abcB062e0',
      eventType: BENCHMARK,
      host: '0x26BfbD8ED2B302ec2c2B6f063C4caF7abcB062e0',
    },
  ]);

  //  {
  //     address: '0x26BfbD8ED2B302ec2c2B6f063C4caF7abcB062e0',
  //     admin: '0x26BfbD8ED2B302ec2c2B6f063C4caF7abcB062e0',
  //     type: 'POLL',
  //     participants: [],
  //     analysts: [],
  //     results: {},
  //     forms: [
  //       {
  //         name: 'A form',
  //         fields: [
  //           {
  //             name: 'Age',
  //             description: 'Select your age group',
  //             type: 'OPTION',
  //             values: [
  //               {
  //                 value: '0',
  //                 name: '18-34',
  //               },
  //               {
  //                 value: '1',
  //                 name: '35-49',
  //               },
  //               {
  //                 value: '2',
  //                 name: '49-75',
  //               },
  //             ],
  //           },
  //           {
  //             name: 'Support',
  //             description: 'Do you support ...?',
  //             type: 'BOOLEAN',
  //           },
  //         ],
  //       },
  //     ],
  //     emailValidationReqquired: true,
  //     passportValidationReqquired: true,
  //     status: 'COMPLETED',
  //     participantThreshold: 10,
  //     isThresholdMet: false,
  //   },

  const [selectedEvent, setSelectedEvent] = useState<Event>();

  const [selectedPoll, setSelectedPoll] = useState<Event>();

  const [selectedBenchmark, setSelectedBenchmark] = useState<Event>();

  useEffect(() => {
    (async () => {
      const _events = await getEvents();
      console.log(_events);
      setEvents(_events);
      setPolls(events.filter((event) => event.eventType === POLL));
      setBenchmarks(events.filter((event) => event.eventType === BENCHMARK));
      const firstPoll = events.find((event) => event.eventType === POLL);
      if (firstPoll) {
        const poll = await getEvent(firstPoll?.eventAddress);
        setSelectedPoll(poll);
      }
      const firstBenchmark = events.find(
        (event) => event.eventType === BENCHMARK,
      );
      if (firstBenchmark) {
        const benchmark = await getEvent(firstBenchmark?.eventAddress);
        setSelectedBenchmark(benchmark);
      }
      const firstEvent = events.length ? events[0] : undefined;
      if (firstEvent) {
        const poll = await getEvent(firstEvent?.eventAddress);
        setSelectedPoll(poll);
      }
    })();
  }, []);

  // useEffect(() => {
  //   const selected = events.find((event) => event.address === eventAddress);
  //   if (selected) {
  //     setSelectedEvent(selected);
  //   }
  // }, [eventAddress]);

  const startEvent = async () => {
    if (!selectedEvent) return;
    const signer = await new ethers.BrowserProvider(
      window.ethereum,
    ).getSigner();
    const eventContract = new ethers.Contract(
      selectedEvent.eventAddress,
      eventAbi,
      provider,
    );
    const contractWithSigner = eventContract.connect(signer);
    // const tx = await eventContract.startEvent();
    // const tx = await contractWithSigner.startEvent();
    // const receipt = await tx.wait();
    // console.log('Transaction confirmed in block:', receipt.blockNumber);
  };

  const editEvent = () => {
    if (!selectedEvent) return;
    navigate(`/${selectedEvent.eventAddress}/settings`);
  };

  const viewResults = () => {
    if (!selectedEvent) return;
    navigate(`/${selectedEvent.eventAddress}/analytics`);
  };

  const stopEvent = async () => {};

  const cancelEvent = async () => {
    console.log('cancel');
    const provider = new BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const message = 'Sign this to verify your identity';
    const signature = await signer.signMessage(message);

    console.log('Signature:', signature);
  };

  const createEvent = async (data: z.infer<typeof FormSchema>) => {
    const entrypointContract = new ethers.Contract(
      contractAddress,
      entrypointAbi,
      provider,
    );
    const contractWithSigner = entrypointContract.connect(signer);
    if (data.type === 'POLL') {
      console.log(
        data.event_name,
        'Just polling',
        100,
        20,
        0,
        0,
        0,
        10,
        data.kyc_required,
        data.email_verification_required,
        {
          gasLimit: 1_000_000,
        },
      );
      const tx = await contractWithSigner.createPoll(
        data.event_name,
        'Just polling',
        100,
        20,
        0,
        0,
        0,
        10,
        data.kyc_required,
        data.email_verification_required,
        {
          gasLimit: 3_000_000,
        },
      );
      const _events = await getEvents();
      setEvents(_events);
      return _events[_events.length - 1][1];
    } else {
      throw new Error('Not implemented');
    }
  };

  const getEvents = async () => {
    // Connect to a provider (e.g., Infura, Alchemy, or a local node)

    const entrypointContract = new ethers.Contract(
      contractAddress,
      entrypointAbi,
      provider,
    );

    const result = await entrypointContract.getEvents();
    return result;
  };

  const createForm = async (
    eventAddress: string,
    data: z.infer<typeof FormSchema>,
  ) => {
    const entrypointContract = new ethers.Contract(
      eventAddress,
      eventAbi,
      provider,
    );
    const contractWithSigner = entrypointContract.connect(signer);
    const fields = [
      {
        name: data.field_0_name,
        encryptedInputType: data.field_0_type === 'option' ? 1 : 7, // ebool
        requirementId: 0,
      },
      {
        name: data.field_1_name,
        encryptedInputType: data.field_1_type === 'option' ? 1 : 7,
        requirementId: 0,
      },
    ];
    console.log(fields);
    await contractWithSigner.createForm(fields, {
      gasLimit: 1_000_000,
    });
  };

  const getEvent = async (eventAddress: string): Promise<Event> => {
    const eventContract = new ethers.Contract(eventAddress, eventAbi, provider);

    const details = await eventContract.getDetails();
    const forms = await eventContract.getForms();

    console.log(details);
    console.log(forms[0][0][0]);
    console.log(forms[0][0][1]);

    return {
      emailValidationReqquired: details[0],
      passportValidationReqquired: details[1],
      status: details[2],
      participantThreshold: details[3],
      isThresholdMet: details[4],
      forms,
    } as Event;
  };

  const submitForm = async () => {
    // TODO
  };

  const selectEvent = async (eventAddress: string) => {
    const event = await getEvent(eventAddress);
    setSelectedEvent(event);
  };

  return (
    <EventContext.Provider
      value={{
        selectedEvent,
        selectedPoll,
        selectedBenchmark,
        events,
        polls,
        benchmarks,
        startEvent,
        editEvent,
        stopEvent,
        cancelEvent,
        getEvents,
        viewResults,
        submitForm,
        createEvent,
        createForm,
        selectEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
