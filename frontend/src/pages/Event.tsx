import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Badge } from '@/components/ui/badge';
import useEvent from '@/hooks/useEvent';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import useAccount from '@/hooks/useAccount';
import { Status } from '@/types';
import { createFhevmInstance, getInstance } from '@/fhevmjs';
import { initFhevm } from 'fhevmjs';
import { useEncrypt } from '@/hooks/useEncrypt';

// TODO Fetch submission for user

const Event = () => {
  const { eventId } = useParams();

  const {
    selectedEvent,
    startEvent,
    stopEvent,
    editEvent,
    cancelEvent,
    viewResults,
    submitForm,
    selectEvent,
  } = useEvent();

  const {
    isConnected,
    canStartEvent,
    canStopEvent,
    canCancelEvent,
    canEditEvent,
    account,
  } = useAccount();

  const [handles, setHandles] = useState<Uint8Array[]>([]);
  const [encryption, setEncryption] = useState<Uint8Array>();


  useEffect(() => {
    selectEvent(eventId);
  }, []);

  const isAdmin = true;

  const [fieldData, setFieldData] = useState<string[]>([]);

  const submit = async () => {
    const data = await Promise.all(fieldData.map(d => {
    // return await encryptAmount(
    //   selectedEvent?.eventAddress as `0x${string}`,
    //   account.address,
    //   BigInt(+fieldData[0]),
    // );
    }))
    await submitForm
  };

  return (
    <div className="p-2">
      {!selectedEvent && eventId && <>ERROR</>}
      <div className="flex gap-2 items-center">
        <h1 className="overflow-hidden">
          {selectedEvent ? (
            <>
              {selectedEvent.type === 'POLL' ? (
                <>
                  {eventId ? (
                    <>Poll{' #' + eventId.substring(0, 10)}...</>
                  ) : (
                    <>Poll select</>
                  )}
                </>
              ) : (
                <>Benchmark</>
              )}
            </>
          ) : (
            <>Event</>
          )}
        </h1>
        {selectedEvent?.status === Status.Completed && (
          <Badge className="bg-yellow-500 mr-auto">Completed</Badge>
        )}
        {selectedEvent?.status === Status.Live && (
          <Badge className="bg-green-500 mr-auto">Live</Badge>
        )}
        {selectedEvent?.status === Status.Planned && (
          <Badge className="bg-blue-500 mr-auto">Planned</Badge>
        )}
        <Button onClick={() => viewResults()} disabled={!selectedEvent}>
          Analytics
        </Button>
        {isAdmin &&
          selectedEvent?.status === Status.Planned &&
          canStartEvent(selectedEvent) && (
            <Button
              onClick={async () => {
                try {
                  await startEvent();
                  toast('Event has been started', {});
                } catch (error) {
                  console.log(error);
                  toast.error('Error: Unable to start event', {});
                }
              }}
              disabled={!selectedEvent}
            >
              Start
            </Button>
          )}
        {isAdmin &&
          selectedEvent?.status === Status.Live &&
          canStopEvent(selectedEvent) && (
            <Button
              onClick={() => {
                try {
                  stopEvent();
                  toast('Event has been started', {});
                } catch (error) {
                  toast.error('Error: Unable to stop event', {});
                }
              }}
              disabled={!selectedEvent}
            >
              Stop
            </Button>
          )}
        {isAdmin &&
          selectedEvent?.status !== Status.Completed &&
          canEditEvent(selectedEvent) && (
            <Button onClick={() => editEvent()} disabled={!selectedEvent}>
              Edit
            </Button>
          )}
        {isAdmin &&
          selectedEvent?.status !== Status.Completed &&
          canCancelEvent(selectedEvent) && (
            <Button
              onClick={() => {
                try {
                  cancelEvent();
                  toast('Event has been started', {});
                } catch (error) {
                  toast.error('Error: Unable to cancel event', {});
                }
              }}
              disabled={!selectedEvent}
            >
              Cancel
            </Button>
          )}
      </div>
      {/* Dynamically create the form */}
      {/* TODO Pick a form too */}
      <div className="flex flex-col gap-10 max-w-[50%] mx-auto mt-10 px-4 border-x-3 min-h-[400px]">
        {selectedEvent?.forms[0].fields.map((field, index) => (
          <div key={index} className="flex justify-between">
            <div>
              <p>{field[0]}</p>
            </div>
            <div>
              {field[1] === 2 ? (
                <Select disabled={selectedEvent.status !== Status.Live}>
                  <SelectTrigger className="w-[320px] mt-[5px] text-white">
                    <SelectValue
                      className="text-white"
                      placeholder="Select a value"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Polls</SelectLabel>
                      {field[2]?.map((value, index) => (
                        <SelectItem key={index} value={value.value as string}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  disabled={selectedEvent.status !== Status.Live}
                  value={fieldData[index]}
                  onValueChange={(val) => {
                    const f = [...fieldData];
                    f[index] = val;
                    setFieldData(f);
                  }}
                >
                  <SelectTrigger className="w-[320px] mt-[5px] text-white">
                    <SelectValue
                      className="text-white"
                      placeholder="Select a value"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-white">Polls</SelectLabel>
                      {field[3].map((value, index) => (
                        <SelectItem key={index} value={index as string}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        ))}
        <Button
          className="ml-auto"
          onClick={() => submit()}
          disabled={!isConnected}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Event;
