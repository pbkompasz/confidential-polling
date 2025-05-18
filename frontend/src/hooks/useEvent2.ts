import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { BrowserProvider, ethers } from 'ethers';
import { ENTRYPOINT_ADDRESS } from '../const';

const EventContext = createContext();


export const EventProvider = ({ children }) => {
  const navigate = useNavigate();

  const provider = new ethers.JsonRpcProvider('http://localhost:8545');

  const contractAddress = ENTRYPOINT_ADDRESS;
  const abi = [
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
  ];

  const eventAbi = [
    {
      inputs: [],
      name: 'startEvent',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  const entrypointContract = new ethers.Contract(
    contractAddress,
    abi,
    provider,
  );

  const [benchmarks, setBenchmarks] = useState<Event[]>([]);
  const [polls, setPolls] = useState<Event[]>([]);
  const [events] = useState<Event[]>([
    {
      address: '0x26BfbD8ED2B302ec2c2B6f063C4caF7abcB062e0',
      admin: '0x26BfbD8ED2B302ec2c2B6f063C4caF7abcB062e0',
      type: 'POLL',
      participants: [],
      analysts: [],
      results: {},
      forms: [
        {
          name: 'A form',
          fields: [
            {
              name: 'Age',
              description: 'Select your age group',
              type: 'OPTION',
              values: [
                {
                  value: '0',
                  name: '18-34',
                },
                {
                  value: '1',
                  name: '35-49',
                },
                {
                  value: '2',
                  name: '49-75',
                },
              ],
            },
            {
              name: 'Support',
              description: 'Do you support ...?',
              type: 'BOOLEAN',
            },
          ],
        },
      ],
      emailValidationReqquired: true,
      passportValidationReqquired: true,
      status: 'COMPLETED',
      participantThreshold: 10,
      isThresholdMet: false,
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(
    events.length ? events[0] : undefined,
  );

  const [selectedPoll, setSelectedPoll] = useState(
    events.find((event) => event.type === 'POLL'),
  );

  const [selectedBenchmark, setSelectedBenchmark] = useState(
    events.find((event) => event.type === 'BENCHMARK'),
  );

  useEffect(() => {
    // (async () => {
    //   const _events = await getEvents();
    //   console.log(_events);
    //   // setEvents(_events);
    //   setPolls(events.filter((event) => event.type === 'POLL'));
    //   setBenchmarks(events.filter((event) => event.type === 'BENCHMARK'));
    // })();
  }, []);

  // useEffect(() => {
  //   const selected = events.find((event) => event.address === eventAddress);
  //   if (selected) {
  //     setSelectedEvent(selected);
  //   }
  // }, [eventAddress]);

  const startEvent = async () => {
    return;
    if (!selectedEvent) return;
    const signer = await new ethers.BrowserProvider(
      window.ethereum,
    ).getSigner();
    const eventContract = new ethers.Contract(
      selectedEvent.address,
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
    navigate(`/${selectedEvent.address}/settings`);
  };

  const viewResults = () => {
    if (!selectedEvent) return;
    navigate(`/${selectedEvent.address}/analytics`);
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

  const getEvents = async () => {
    // Connect to a provider (e.g., Infura, Alchemy, or a local node)

    const result = await entrypointContract.getEvents();
    return result;
    // console.log(result);
  };

  const submitForm = async () => {
    // TODO
  };

  // return {
  //   selectedEvent,
  //   selectedPoll,
  //   selectedBenchmark,
  //   events,
  //   polls,
  //   benchmarks,
  //   startEvent,
  //   editEvent,
  //   stopEvent,
  //   cancelEvent,
  //   getEvents,
  //   viewResults,
  //   submitForm,
  // };

  return (
    <EventContext.Provider value={{ selectedEvent, events }}>
      {children}
    </EventContext.Provider>
  );

};

export const useEvent = () => {
  const { selectedEvent, events } = useContext(EventContext)
  return { selectedEvent, events }
}