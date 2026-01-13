import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  FixedCost: a.model({  // Renamed from Subscription (reserved)
    name: a.string(),
    cost: a.float(),
  }).authorization(allow => [allow.owner()]),

  Expense: a.model({
    expenseDate: a.string().required(),
    description: a.string(),
    amount: a.float().required(),
    category: a.string().required(),
    merchant: a.string(),
    userID: a.string().required(),
  }).authorization(allow => [allow.owner()]),

  User: a.model({
    email: a.string(),
    name: a.string(),
    currency: a.string(),
    budgetMonthly: a.float(),
    timezone: a.string(),
    phone: a.string(),
    lastLogin: a.string(),
    isActive: a.boolean(),
    profileOwner: a.string().required(),
  }).authorization(allow => [allow.ownerDefinedIn('profileOwner')]),
});

export type Schema = ClientSchema<typeof schema>;


export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
