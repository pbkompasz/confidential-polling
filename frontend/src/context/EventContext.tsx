import { BENCHMARK, ENTRYPOINT_ADDRESS, POLL, VERIFIER_URL } from '@/const';
import { BrowserProvider, ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EvaluationType,
  Event,
  EventListItem,
  StorageType,
  ValidationType,
} from '../types';
import useAccount from '../hooks/useAccount';
import { FormSchema } from '@/components/Home';
import { z } from 'zod';
import { entrypointAbi, eventAbi } from '@/abi';

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
  getDetailedEvents: any;
  getEventUserRole: any;
};

export const EventContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const EventProvider = ({ children }: { children: any }) => {
  const navigate = useNavigate();
  const { signer } = useAccount();

  const provider = new ethers.JsonRpcProvider('http://localhost:8545');

  const contractAddress = ENTRYPOINT_ADDRESS;

  const [benchmarks, setBenchmarks] = useState<EventListItem[]>([]);
  const [polls, setPolls] = useState<EventListItem[]>([]);
  const [events, setEvents] = useState<EventListItem[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<Event>();

  const [selectedPoll, setSelectedPoll] = useState<Event>();

  const [selectedBenchmark, setSelectedBenchmark] = useState<Event>();

  useEffect(() => {
    (async () => {
      const _events = await getEvents();
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

  const getDetailedEvents = async (events: string[]) => {
    return await Promise.all(
      events.map(async (event) => {
        const eventContract = new ethers.Contract(event, eventAbi, provider);
        const resp = await eventContract.getDetails();
        console.log(resp);
        return {
          eventAddress: event,
          name: resp[0],
          status: resp[1],
          eventType: resp[2],
          noParticipants: parseInt(resp[3]),
          requiresEmailValidation: resp[4],
          requiresPassportValidation: resp[5],
        };
      }),
    );
  };

  // useEffect(() => {
  //   const selected = events.find((event) => event.address === eventAddress);
  //   if (selected) {
  //     setSelectedEvent(selected);
  //   }
  // }, [eventAddress]);

  const startEvent = async () => {
    if (!selectedEvent) return;
    const eventContract = new ethers.Contract(
      selectedEvent.eventAddress,
      eventAbi,
      provider,
    );
    const contractWithSigner = eventContract.connect(signer);
    const tx = await contractWithSigner.startEvent({
      gasLimit: 300_000,
    });
    const receipt = await tx.wait();
    await getEvent(selectedEvent.eventAddress);
    console.log('Transaction confirmed in block:', receipt.blockNumber);
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
      // @ts-expect-error Functions not recognized
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
      await tx.wait();
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
    // @ts-expect-error Functions not recognized
    await contractWithSigner.createForm(fields, {
      gasLimit: 1_000_000,
    });
  };

  const getEventUserRole = async (eventAddress: string): Promise<string> => {
    const eventContract = new ethers.Contract(eventAddress, eventAbi, provider);
    return await eventContract.getEventUserRole(eventAddress);
  };

  const getEvent = async (eventAddress: string): Promise<Event> => {
    const eventContract = new ethers.Contract(eventAddress, eventAbi, provider);

    const details = await eventContract.getDetailsFull();
    const forms = await eventContract.getForms();

    // forms[0].map(f => {
    //     // Name
    //     console.log(f[0][0])
    //     // EncrypteionType
    //     console.log(f[0][1])
    //     // Requiremnt id
    //     // console.log(f[0][2])
    //     // return {
    //     //   fields: [
    //     //     {
    //     //       name: form[0][0],
    //     //       encryptedInputType: parseInt(form[0][1]),
    //     //       requirementId: form[0][2],
    //     //       values: form[0][3]
    //     //     }
    //     //   ],
    //     //   id: form[1],
    //     //   mainField: form[2],
    //     // };
    //     return f
    // });

    // console.log(details);
    // console.log(forms[0][0][0]);
    // console.log(forms[0][0][1][3]);
    // console.log(details[13])

    return {
      name: details[0],
      description: details[1],
      host: details[2],
      maximumPariticpants: details[3],
      evaluationType: details[4],
      validationType: details[5],
      storageType: details[6],
      evaluationBatch: details[7],
      minSubmissions: details[8],
      lastSubmissionEvaluated: details[9],
      type: details[10],
      requiresEmailValdation: details[11],
      requiresPassportValdation: details[12],
      status: parseInt(details[13].toString()),
      participantThreshold: details[14],
      isThresholdMet: details[15],
      eventAddress,
      forms,
    };
  };

  /**
   * Submit data to the bundler
   */
  const submitForm = async (data: any[], inputProof: any) => {
    // Submit data for bundler
    await fetch(`${VERIFIER_URL}/submit`, {
      method: 'post',
      body: JSON.stringify({
        data,
        inputProof,
      }),
    });
    // Create entry in SC
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
        getDetailedEvents,
        getEventUserRole,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

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
