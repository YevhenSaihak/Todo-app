import type { JSONSchema } from '@ngx-pwa/local-storage';

export const TODO_ARRAY_SCHEMA: JSONSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', maxLength: 100 },
      createdAt: { type: 'string' },
      expirationDate: { type: 'string' },
      expirationTime: { type: 'string' },
      favorite: { type: 'boolean' },
    },
    required: ['id', 'title', 'createdAt', 'expirationDate', 'favorite'],
  },
};
