import { DataSubmission, DataTemplate, Event } from "./types";

export const submitData = (event: Event, template: number, data: DataSubmission[]) => {
  data.forEach(d => {
    const t = event.dataTemplates[template];
    const field = t.fields[d.dataField];
    if (field.type !== String(typeof d.data).toUpperCase()) {
      throw new Error("Wrong type!");
    }
  });

  // Submit data to blob

  // Store hash on-chain

  // NOTE Analytics will pull the data from IPFS when creating result
}