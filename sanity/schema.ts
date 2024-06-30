import { type SchemaTypeDefinition } from 'sanity';
import event from './schemas/event';

export const schemaTypes = [event];

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [event],
};
