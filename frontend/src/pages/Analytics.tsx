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
import useEvent from '@/useEvent';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const Analytics = () => {
  const { eventId } = useParams();
  const { selectedEvent, events } = useEvent(eventId);

  const constraints = [
    {
      name: 'asd',
    },
  ];

  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb',
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;

  return (
    <div className="p-2">
      <div className="flex gap-2 items-center">
        <h1>Analytics {eventId}</h1>
        <Select>
          <SelectTrigger className="w-[320px] mt-[5px] text-white">
            <SelectValue
              className="text-white"
              placeholder="Select a poll or benchmark event"
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
        </Select>
      </div>
      <div>
        {/* TODO Will pull the constrains from SC and "decrypt" the constraint string */}
        <h2>Details </h2>
        <Badge>Status</Badge>
        <p>Total participants: {selectedEvent?.participants.length}</p>
        <p>Responses evaluated: {selectedEvent?.participants.length}</p>
        <p>Evaluation batch size: {selectedEvent?.participants.length}</p>

        <Select>
          <SelectTrigger className="mt-[5px] text-white">
            <SelectValue
              className="text-white"
              placeholder="Select constraint"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Constraints</SelectLabel>
              {constraints.map((constraint) => (
                <SelectItem value={constraint.name}>
                  {constraint.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] max-h-[200px] w-[400px]"
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default Analytics;
