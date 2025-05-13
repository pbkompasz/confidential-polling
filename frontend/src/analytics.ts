import { DataField } from './types';

// These methods can be called by the analyst to create analytics for each data field e.g. age, gender or data fields e.g. age + gender
// TODO After smart contract methods are done

const generateAnalyticsNumberField = (field: DataField, range: [number, number]) => {
  switch (field.type) {
    case 'BOOLEAN':
      break;

    default:
      break;
  }
};
