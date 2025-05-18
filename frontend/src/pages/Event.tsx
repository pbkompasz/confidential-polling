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
import { useEffect } from 'react';

const Event = () => {
  const { eventId } = useParams();

  const {
    selectedEvent,
    startEvent,
    stopEvent,
    editEvent,
    cancelEvent,
    viewResults,
    selectEvent,
  } = useEvent();

  useEffect(() => {
    selectEvent(eventId);
  }, []);

  // NOTE Admins can submit their own polls/benchmarks
  const isAdmin = true;

  return (
    <div className="p-2">
      {!selectedEvent && eventId && <>ERROR</>}
      <div className="flex gap-2 items-center">
        <h1 className="max-w-[300px] overflow-hidden">
          {selectedEvent ? (
            <>
              {selectedEvent.type === 'POLL' ? (
                <>{eventId ? <>Poll#{eventId}</> : <>Poll select</>}</>
              ) : (
                <>Benchmark</>
              )}
            </>
          ) : (
            <>Event</>
          )}
        </h1>
        <Badge variant="outline" className="max-h-[20px] mr-auto">
          {selectedEvent?.status}
        </Badge>
        {/* <Select>
          <SelectTrigger className="w-[180px] mt-[5px] text-white mr-auto">
            <SelectValue className="text-white" placeholder="Select a form" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Forms</SelectLabel>
              {selectedEvent?.forms.map((form, index) => (
                <SelectItem key={index} value={form.name}>
                  {form.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select> */}
        {selectedEvent?.results && selectedEvent?.status === 'COMPLETED' && (
          <Button onClick={() => viewResults()} disabled={!selectedEvent}>
            View results
          </Button>
        )}
        {isAdmin && selectedEvent?.status === 'PLANNED' && (
          <Button
            onClick={async () => {
              try {
                await startEvent();
                toast('Event has been started', {});
              } catch (error) {
                toast.error('Error: Unable to start event', {});
              }
            }}
            disabled={!selectedEvent}
          >
            Start
          </Button>
        )}
        {isAdmin && selectedEvent?.status === 'LIVE' && (
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
        {isAdmin && selectedEvent?.status !== 'COMPLETED' && (
          <Button onClick={() => editEvent()} disabled={!selectedEvent}>
            Edit
          </Button>
        )}
        {isAdmin && selectedEvent?.status !== 'COMPLETED' && (
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
              <p>{field.name}</p>
              <p>{field.description}</p>
            </div>
            <div>
              {field.type === 'OPTION' ? (
                <Select disabled={selectedEvent.status !== 'LIVE'}>
                  <SelectTrigger className="w-[320px] mt-[5px] text-white">
                    <SelectValue
                      className="text-white"
                      placeholder="Select a value"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Polls</SelectLabel>
                      {field.values?.map((value, index) => (
                        <SelectItem key={index} value={value.value as string}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Select disabled={selectedEvent.status !== 'LIVE'}>
                  <SelectTrigger className="w-[320px] mt-[5px] text-white">
                    <SelectValue
                      className="text-white"
                      placeholder="Select a value"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Polls</SelectLabel>
                      <SelectItem value={'yes'}>Yes</SelectItem>
                      <SelectItem value={'no'}>No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        ))}
        <Dialog>
          <DialogTrigger
            asChild
            className="ml-auto"
            disabled={selectedEvent?.status !== 'LIVE'}
          >
            <Button variant="outline" className="text-white">
              Submit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Event;
