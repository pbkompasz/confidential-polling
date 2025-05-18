import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useEvent from '../hooks/useEvent.ts';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { POLL } from '../const.ts';
import { Input } from './ui/input.tsx';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import useAccount from '@/hooks/useAccount.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip.tsx';
import { Badge } from './ui/badge.tsx';
import { Devnet } from '../components/Devnet';
import { Connect } from '../components/Connect/index.ts';
import { init } from '@/fhevmjs.ts';

export const FormSchema = z.object({
  kyc_required: z.boolean().default(false).optional(),
  email_verification_required: z.boolean(),
  field_0_type: z.string(),
  field_0_name: z.string(),
  field_0_value: z.string(),
  field_1_type: z.string(),
  field_1_name: z.string(),
  field_1_value: z.string(),
  event_name: z.string(),
  type: z.string(),
});

const Home = () => {
  const { events, createEvent, createForm, getDetailedEvents } = useEvent();
  const [detailedEvents, setDetailedEvents] = useState([]);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Trick to avoid double init with HMR
    if (window.fhevmjsInitialized) return;
    window.fhevmjsInitialized = true;
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch((e) => {
        console.log(e);
        setIsInitialized(false);
      });
  }, []);


  useEffect(() => {
    (async () => {
      const detailedEvents = await getDetailedEvents(
        events.map((event) => event[1]),
      );
      setDetailedEvents(detailedEvents);
    })();
  }, [events]);

  const [isOpen, setIsOpen] = useState(false);

  const { isConnected } = useAccount();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      event_name: 'Event nameasd',
      kyc_required: true,
      email_verification_required: true,
      field_0_type: 'option',
      field_0_name: '',
      field_0_value: '',
      field_1_type: 'boolean',
      field_1_name: '',
      field_1_value: '',
      type: 'POLL',
    },
  });

  const [newFields, setNewFields] = useState([
    {
      type: 'boolean',
    },
    {
      type: 'option',
    },
  ]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const eventAddress = await createEvent(data);
      toast(`New ${data.type.toLowerCase()} created`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await createForm(eventAddress, data);
      toast(`Added form`);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error: Creating survey');
      setIsOpen(false);
    }
  }

  if (!isInitialized) return null;

  return (
    <div className="p-2 flex flex-col text-center">
      <p className="text-3xl my-[20px]">Public Surveys, Private Data</p>
      <p className="text-2xl mb-[50px]">
        Confidential polling and benchmarking powered by FHE
      </p>
      <div className="bg-red-50">
        <p className="text-xl mt-[30px]">
          Create an account and fill out a form
        </p>
        <Table className="max-w-[70%] mx-auto my-[50px] bg-white">
          <TableCaption>A list of polls and benchmarks</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              {/* <TableHead className="text-center">Status</TableHead> */}
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-right">Participants</TableHead>
              <TableHead className="text-right">KYC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detailedEvents.map((event) => (
              <TableRow key={event.eventAddress}>
                <TableCell className="font-medium">
                  <div className="">
                    <Link to={`/${event.eventAddress}`}>
                      {event.eventAddress.substring(0, 12)}...
                    </Link>
                  </div>
                </TableCell>
                {/* <TableCell>{event.status}</TableCell> */}
                <TableCell>
                  {event.eventType === 'POLL' ? 'Poll' : 'Benchmark'}
                </TableCell>
                <TableCell className="text-right">
                  {event.noParticipants}
                </TableCell>
                <TableCell className="text-right ">
                  {!event.requiresEmailValidation &&
                  !event.requiresPassportValidation ? (
                    <>No extra KYC required</>
                  ) : (
                    <div className="flex flex-row-reverse items-center gap-2">
                      {event.requiresPassportValidation && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="max-h-[20px]">
                                <img
                                  src="https://pbs.twimg.com/profile_images/1819859281639829504/HsRc4VVq_400x400.jpg"
                                  alt="passport"
                                  width={20}
                                  height={20}
                                />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Passport verification required</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {event.requiresEmailValidation && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="max-h-[20px]">
                                <img
                                  src="https://avatars.githubusercontent.com/u/109933158?s=200&v=4"
                                  alt="email"
                                  width={20}
                                  height={20}
                                />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Email verification required</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* <Connect>
          {(account, provider) => (
            <Devnet account={account} provider={provider} />
          )}
        </Connect> */}

        <p className="text-xl">
          Register as a host and create a new polling/benchmarking survey
        </p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild className="ml-auto my-[20px]">
            <Button
              disabled={!isConnected}
              variant="outline"
              className="text-white "
            >
              <p className="text-md">Create survey</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new form</DialogTitle>
              <DialogDescription>
                Set the name, description, KYC requirements and and add fields
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                  <div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="event_name"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg px-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Name</FormLabel>
                              <FormDescription>
                                Give a name to the poll
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Input
                                id={field.value}
                                value="A poll"
                                className="col-span-3 max-w-[50%]"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`type`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg px-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base"></FormLabel>
                              <FormDescription className="text-md">
                                Survey type
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="text-white col-span-3 text-xs w-[130px]">
                                  <SelectValue
                                    className="text-white text-xs"
                                    placeholder="Select field type"
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Field type</SelectLabel>
                                    <SelectItem value="POLL">Poll</SelectItem>
                                    <SelectItem value="BENCHMARK">
                                      Benchmark
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="border p-4 flex flex-col gap-3">
                        {newFields.map((_, index) => (
                          <div key={index}>
                            <FormField
                              control={form.control}
                              name={`field_${index}_name` as 'field_0_name'}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base"></FormLabel>
                                    <FormDescription className="text-md">
                                      #{index + 1} Name
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Input
                                      id={`field-${index}`}
                                      {...field}
                                      className="col-span-3 max-w-[50%]"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`field_${index}_type` as 'field_0_type'}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg mt-2">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base"></FormLabel>
                                    <FormDescription>
                                      Field type
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger className="text-white col-span-3 text-xs w-[130px]">
                                        <SelectValue
                                          className="text-white text-xs"
                                          placeholder="Select field type"
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>Field type</SelectLabel>
                                          <SelectItem value="option">
                                            Option
                                          </SelectItem>
                                          <SelectItem value="boolean">
                                            T/F
                                          </SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`field_${index}_value` as 'field_0_value'}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg w-full mt-2">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base"></FormLabel>
                                    <FormDescription>Options</FormDescription>
                                  </div>
                                  <FormControl>
                                    <div className="flex flex-row gap-2 max-w-[70%] items-center">
                                      <Input
                                        id={`field-${index}`}
                                        {...field}
                                        className="col-span-3"
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                        <div className="flex flex-row-reverse mt-4">
                          <Button type="button">
                            <p
                              className="text-xs"
                              onClick={() => {
                                setNewFields([
                                  {
                                    type: '',
                                  },
                                  ...newFields,
                                ]);
                              }}
                            >
                              Add new field
                            </p>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse mt-[20px]">
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="p-2">
        <p className="text-2xl">How it works</p>
        <div className="flex justify-evenly gap-2 mt-3">
          <div className="border w-[300px] h-[120px] p-2 text-center flex items-center">
            <p className="my-auto">
              1. User signs up as a host and creates a poll or benchmarking
              survey
            </p>
          </div>
          <div className="border w-[300px] h-[120px] p-2 text-center flex items-center">
            <p>
              2. Users fill out the forms and submit their data confidentially
            </p>
          </div>
          <div className="border w-[300px] h-[120px] p-2 text-center flex items-center">
            <p>
              3. Analysts can take the confidential data and analize it without
              revealing any users' response
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
