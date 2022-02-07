import { capitalize } from 'src/utils/formatter';

const Messages: any = {
  Forms: {
    FieldRequired: (fieldName: string) => `${capitalize(fieldName)} is required`
  }
};

export default Messages;
