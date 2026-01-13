## AWS Amplify React+Vite Starter Template

This repository provides a starter template for creating applications using React+Vite and AWS Amplify, emphasizing easy setup for authentication, API, and database capabilities.

## Overview

This template equips you with a foundational React application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

To run: 

# 1. Clone + install
git clone <repo>
cd Financial-Tracker
npm install

# 2. Backend setup (generates their own DB)
npx ampx sandbox          # Or: npx amplify sandbox

# 3. Frontend
npm run dev

Share your deployed AppSync endpoint:
	1.	 npx ampx status  → Copy GraphQL endpoint
	2.	Give them  amplify_outputs.json  (or env vars)
	3.	They run  npm run dev  → uses YOUR live DB