// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';

const schema = a.schema({
  Subscription: a.model({  // Your fixed costs model
    name: a.string(),
    cost: a.float(),
  }).authorization(allow => [allow.owner()]),  // Owner-only access

  Transaction: a.model({  // Expenses/transactions
    date: a.string(),
    desc: a.string(),
    amount: a.float(),
    cat: a.string(),
  }).authorization(allow => [allow.owner()]),  // Owner-only access

  UserProfile: a.model({
    email: a.string(),
    profileOwner: a.string(), // Links to Cognito 'sub'
  }).authorization(allow => [
    allow.ownerDefinedIn('profileOwner'), // This model is isolated per user
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const postConfirmation = defineFunction({
  name: 'post-confirmation',
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
