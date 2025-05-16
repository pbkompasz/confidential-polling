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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useEvent from '@/useEvent';

const Admin = () => {
  const { polls, benchmarks, selectedPoll, selectedBenchmark } = useEvent();

  return (
    <div className="p-2">
      <h1>Admin</h1>
      <div className="w-[50%] mx-auto px-4 mt-10 border-x-3">
        <div className="p-2">
          <h2>General</h2>
          <div className="p-2">
            <div>asd</div>
          </div>
        </div>
        <div className="p-2">
          <div className="flex gap-2 items-center">
            <h2>Poll</h2>
            <Select value={selectedPoll?.address}>
              <SelectTrigger className="mt-[5px] max-w-[220px] text-white">
                <SelectValue className="text-white" placeholder="Select poll" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Polls</SelectLabel>
                  {polls.map((poll) => (
                    <SelectItem value={poll.address}>{poll.address}</SelectItem>
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
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
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
            {selectedPoll?.forms.map((form) => (
              <div key={form.name}>
                <h2>{form.name}</h2>
                {form.fields.map((field) => (
                  <div className="flex justify-between mb-2">
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
                <SelectValue className="text-white" placeholder="Select poll" />
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
                    done.
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
