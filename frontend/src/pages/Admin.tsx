import { Button } from '@/components/ui/button';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useEvent from '@/hooks/useEvent';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useParams, useSearchParams } from 'react-router-dom';
import useAccount from '@/hooks/useAccount';

const Admin = () => {
  const { polls, benchmarks, selectedPoll, selectedBenchmark } = useEvent();
  const { isConnected} = useAccount();

  const [requireEmailVerification] = useState(true);
  const FormSchema = z.object({
    kyc_required: z.boolean().default(false).optional(),
    email_verification_required: z.boolean(),
    field_0_type: z.string(),
    field_0_name: z.string(),
    field_0_value: z.string(),
    field_1_type: z.string(),
    field_1_name: z.string(),
    field_1_value: z.string(),
    poll_name: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      poll_name: 'Poll name',
      kyc_required: true,
      email_verification_required: true,
      field_0_type: 'option',
      field_0_name: '',
      field_0_value: '',
      field_1_type: 'option',
      field_1_name: '',
      field_1_value: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    toast(
      'You submitted the following values:',
      // {
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      //   </pre>
      // ),
    );
  }

  const [newFields, setNewFields] = useState([
    {
      type: 'boolean',
    },
    {
      type: 'option',
    },
  ]);

  const { eventId } = useParams();

  return (
    <div className="p-2">
      <p className="text-2xl">{eventId}</p>
      <div className="w-[50%] mx-auto px-4 mt-10 border-x-3">
        <div className="p-2">
          <h2>General settings</h2>
          {isConnected.toString()}
          <div className="pt-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="kyc_required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          KYC Required
                        </FormLabel>
                        <FormDescription>
                          Users have to prove their identity w/ passport
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email_verification_required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Email Verification Required
                        </FormLabel>
                        <FormDescription>
                          Require email verification from users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
        <div className="p-2">
          <div className="flex gap-2 items-center">
            <h2>Poll</h2>
            <Select value={selectedBenchmark?.address}>
              <SelectTrigger className="mt-[5px] text-white">
                <SelectValue className="text-white" placeholder="Select poll" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Polls</SelectLabel>
                  {polls.map((benchmark) => (
                    <SelectItem value={benchmark.address}>
                      {benchmark.address}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild className="ml-auto">
                <Button variant="outline" className="text-white ">
                  <p className="text-xs">Create poll +</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add new form</DialogTitle>
                  <DialogDescription>
                    Set the name, description, KYC requirements and and add
                    fields
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-full"
                    >
                      <div>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="poll_name"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Name
                                  </FormLabel>
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

                          <div className="border p-4 flex flex-col gap-3">
                            {newFields.map((formField, index) => (
                              <div>
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
                                          value="Pedro Duarte"
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
                                        <Select value={field.value}>
                                          <SelectTrigger className="text-white col-span-3 text-xs">
                                            <SelectValue
                                              className="text-white text-xs"
                                              placeholder="Select field type"
                                            />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectLabel>
                                                Field type
                                              </SelectLabel>
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
                                  name={
                                    `field_${index}_value` as 'field_0_value'
                                  }
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg w-full mt-2">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base"></FormLabel>
                                        <FormDescription>
                                          Options
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        {formField.type === 'boolean' ? (
                                          <div className="flex flex-row gap-2 max-w-[70%] items-center">
                                            1:{' '}
                                            <Input
                                              id={`field-${index}`}
                                              value="Agree"
                                              className="col-span-3 max-w-[50%]"
                                            />
                                            0:{' '}
                                            <Input
                                              id={`field-${index}`}
                                              value="Disagree"
                                              className="col-span-3 max-w-[50%]"
                                            />
                                          </div>
                                        ) : (
                                          <div>
                                            <Input
                                              id={`field-${index}`}
                                              value="OPTION_1;OPTION_2;OPTION_3"
                                              className="col-span-3"
                                            />
                                          </div>
                                        )}
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
                      <div className="flex flex-row-reverse">
                        <Button type="submit">Submit</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="pt-2">
            {selectedPoll?.forms.map((form, index) => (
              <div key={form.name} className="border p-2">
                <p className="text-xl mb-2 flex items-baseline">
                  Form #{index + 1}: <p className="underline"> {form.name}</p>
                </p>
                {form.fields.map((field) => (
                  <div className="flex justify-between mb-2 py-2 px-1 bg-red-50 border">
                    <div>
                      <p>{field.name}</p>
                      <p>{field.description}</p>
                    </div>

                    <Popover>
                      <PopoverTrigger>
                        <Button
                          variant="outline"
                          className="text-white max-h-[20px] max-w-[50px]"
                        >
                          <p className="text-sm">Edit field</p>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        {field.type === 'ADDRESS' && (
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                Dimensions
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Set the dimensions for the layer.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Min.</Label>
                                <Input
                                  id="width"
                                  defaultValue="100%"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxWidth">Max.</Label>
                                <Input
                                  id="maxWidth"
                                  defaultValue="300px"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxHeight">
                                  Forbidden values
                                </Label>
                                <Input
                                  id="maxHeight"
                                  defaultValue="none"
                                  className="col-span-2 h-8"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {field.type === 'NUMBER' && (
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                Numeric input
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Set the values.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Min.</Label>
                                <Input
                                  id="min"
                                  defaultValue="0"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxWidth">Max.</Label>
                                <Input
                                  id="max"
                                  defaultValue="100"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxHeight">
                                  Forbidden values
                                </Label>
                                <Input
                                  id="forbiddenValues"
                                  defaultValue="none"
                                  className="col-span-2 h-8"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {field.type === 'OPTION' && (
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                Options
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Add, modify or remove options
                              </p>
                            </div>
                            <div className="grid gap-2">
                              {field.values?.map((value) => (
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="width">{value.name}</Label>
                                  <Input
                                    id="width"
                                    defaultValue={value.value as string}
                                    className="col-span-2 h-8"
                                  />
                                </div>
                              ))}

                              <Separator />

                              <div className="flex w-full">
                                <div className="w-3/4  gap-2 flex flex-row">
                                  <Input
                                    id="name"
                                    defaultValue=""
                                    className="col-span-2 h-8 amx-w-full"
                                  />
                                  <Input
                                    id="value"
                                    defaultValue=""
                                    className="col-span-2 h-8"
                                  />
                                </div>

                                <div className="w-1/4 ml-4">
                                  <Button className="h-8 max-w-full">
                                    <p className="text-xs">Add option</p>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="p-2">
          <div className="flex gap-2">
            <h2>Benchmarks</h2>
            <Select value={selectedBenchmark?.address}>
              <SelectTrigger className="mt-[5px] text-white">
                <SelectValue
                  className="text-white"
                  placeholder="Select benchmark"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Benchmarks</SelectLabel>
                  {benchmarks.map((benchmark) => (
                    <SelectItem value={benchmark.address}>
                      {benchmark.address}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild className="ml-auto">
                <Button variant="outline" className="text-white">
                  <p className="text-xs">Create benchmark +</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value="Pedro Duarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="p-2">
            {selectedBenchmark?.forms.map((form) => (
              <div key={form.name}>
                <h2>{form.name}</h2>
                {form.fields.map((field) => (
                  <div className="flex justify-between">
                    <div>
                      <p>{field.name}</p>
                      <p>{field.description}</p>
                    </div>
                    {field.type === 'NUMBER' ||
                      (field.type === 'ADDRESS' && (
                        <Popover>
                          <PopoverTrigger>
                            <Button
                              variant="outline"
                              className="text-white max-h-[20px] max-w-[50px]"
                            >
                              <p className="text-sm">Edit field</p>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">
                                  Dimensions
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Set the dimensions for the layer.
                                </p>
                              </div>
                              <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="width">Min.</Label>
                                  <Input
                                    id="width"
                                    defaultValue="100%"
                                    className="col-span-2 h-8"
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="maxWidth">Max.</Label>
                                  <Input
                                    id="maxWidth"
                                    defaultValue="300px"
                                    className="col-span-2 h-8"
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="maxHeight">
                                    Forbidden values
                                  </Label>
                                  <Input
                                    id="maxHeight"
                                    defaultValue="none"
                                    className="col-span-2 h-8"
                                  />
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
