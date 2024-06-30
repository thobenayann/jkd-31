import { SchemaTypeDefinition } from 'sanity';

import post from './event';

export const schemaTypes = [post];
export const schema: { types: SchemaTypeDefinition[] } = {
    types: [post],
};
