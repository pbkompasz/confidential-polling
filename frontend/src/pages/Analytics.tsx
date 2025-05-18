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
import { Badge } from '@/components/ui/badge';
import useEvent from '@/hooks/useEvent';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Status, StorageType } from '@/types';
import useAccount from '@/hooks/useAccount';

const Analytics = () => {
  const { eventId } = useParams();
  const { selectedEvent, events } = useEvent();
  const { canQuery } = useAccount()

  const chartData = [{ month: 'COUNT', femaleAgree: 1, mobile: 0 }];

  const chartConfig = {
    femaleAgree: {
      label: 'Female-Agree',
      color: '#2563eb',
    },
    other: {
      label: 'Other',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col h-[90vh]">
      <div className="flex items-start border-b min-h-[200px]">
        <div className="flex gap-2 p-4 min-w-[300px]">
          <p className="text-2xl max-w-[250px] overflow-hidden text-ellipsis">
            {eventId}
          </p>
          {selectedEvent?.status === Status.Completed && (
            <Badge className="bg-yellow-500">Completed</Badge>
          )}
          {selectedEvent?.status === Status.Live && (
            <Badge className="bg-green-500">Live</Badge>
          )}
          {selectedEvent?.status === Status.Planned && (
            <Badge className="bg-blue-500">Planned</Badge>
          )}
        </div>
        {/* <Select>
          <SelectTrigger className="w-[220px] mt-[5px] text-white">
            <SelectValue
              className="text-white"
              placeholder="Select a form"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Polls</SelectLabel>
              {events.map((event) => (
                <SelectItem value={event.address}>{event.address}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select> */}
        <div className="flex flex-row pl-4 border-l h-full w-full max-h-full flex-wrap text-lg">
          <div className="max-h-[50px] w-full">
            <h2>Details</h2>
          </div>
          <div className="flex flex-col flex-wrap w-full max-h-[160px]">
            <p>
              Total participants: {selectedEvent?.participants?.length ?? 'N/A'}
            </p>
            <p>
              Responses evaluated:{' '}
              {selectedEvent?.participants?.length ?? 'N/A'}
            </p>
            <p>
              Evaluation batch size: {selectedEvent?.evaluationBatch.toString()}
            </p>
            <p>Survey type: {selectedEvent?.type}</p>
            <p>Analysts: 1</p>
            <p>
              Latest results (timestamp):{' '}
              {selectedEvent?.lastSubmissionEvaluated}
              N/A
            </p>
            <p>Total forms: {selectedEvent?.forms?.length ?? '0'}</p>
            <p>
              {selectedEvent?.requiresPassportValdation
                ? 'Passport verification required'
                : 'No passport verification is required'}
            </p>
            <p>
              {selectedEvent?.requiresEmailValdation
                ? 'Email verification required'
                : 'Email verification is not required'}
            </p>
            <p>
              Min. required participants: {selectedEvent?.minSubmissions}
              <Badge className="bg-orange-500">Threshold not met</Badge>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row h-full">
        {/* TODO Will pull the constrains from SC and "decrypt" the constraint string */}
        <div className="w-[70%] border-r p-2">
          <div className="flex flex-row gap-2 items-baseline">
            {selectedEvent?.forms &&
              selectedEvent?.forms[0].fields.map((field) => (
                <Select key={field.name}>
                  <SelectTrigger className="mt-[5px] text-white">
                    <SelectValue
                      className="text-white"
                      placeholder={field.name}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Constraints</SelectLabel>
                      {field[3].map((f, index) => (
                        <SelectItem value={index}>{f}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ))}
            <Select>
              <SelectTrigger className="mt-[5px] text-white">
                <SelectValue className="text-white" placeholder="Operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Constraints</SelectLabel>
                  <SelectItem value="SUM">Sum</SelectItem>
                  <SelectItem value="COUNT">Count</SelectItem>
                  <SelectItem value="AVG">Avg</SelectItem>
                  <SelectItem value="MIN">Min</SelectItem>
                  <SelectItem value="MAX">Max</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {canQuery() && <Button>Create query</Button>}
          </div>
          <ChartContainer
            config={chartConfig}
            className="w-[70%] mx-auto mt-[50px]"
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="femaleAgree" fill="var(--color-femaleAgree)" radius={4} />
              <Bar dataKey="other" fill="var(--color-other)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="max-w-[30%] p-4">
          <h2>
            Storage(
            {parseInt(selectedEvent?.storageType) === StorageType.Onchain &&
              'Onchain'}
            {parseInt(selectedEvent?.storageType) === StorageType.Offchain &&
              'Offchain'}
            {parseInt(selectedEvent?.storageType) === StorageType.Hybrid &&
              'Hybrid'}
            )
          </h2>
          <div className='mt-2'>
            <p className='text-lg'>1. {"f3a0b8d9276e6bcb77dbdf5bc7d561b7279a88e2d1e3ec0eae1cbaaa0e9c71c4".substring(0, 20)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
