# PowerHub

PowerHub is a web application designed to help consumers track their electricity usage and its respective cost. The platform provides real-time data through an interactive dashboard supported by various AWS services, ensuring a responsive and secure user experience.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Setup and Configuration](#setup-and-configuration)
- [Operations](#operations)
- [Custom Library](#custom-library)
- [Contributing](#contributing)
- [License](#license)

## Introduction

PowerHub aims to bridge the gap between consumers and electricity providers by providing detailed energy consumption data and enhanced customer service features.

## Features

- **User Authentication:** Secure login and signup features with JWT for authentication and authorization.
- **Data Visualization:** Real-time data display using bar graphs and pie charts for daily consumption and peak/off-peak hours analysis.
- **Customer Support:** Allows users to lodge and track complaints, with notifications sent via AWS SNS.
- **Bill Management:** Monthly bills generated and downloadable, stored in AWS S3.
- **Real-time Data:** Automatic daily data collection and storage in DynamoDB.
- **Admin Dashboard:** Special access for admin users to manage user data and complaints.

## Technologies

The project is built with the following technologies:

- **ReactJS:** A JavaScript library for building user interfaces.
- **Redux:** A state management tool for JavaScript apps.
- **Node.js:** A JavaScript runtime for building the backend.
- **Express.js:** A web application framework for Node.js.
- **TypeScript:** A typed superset of JavaScript.
- **AWS DynamoDB:** For real-time data storage and retrieval.
- **AWS S3:** For storing electricity bills.
- **AWS SQS:** For managing customer support notifications.
- **AWS SNS:** For sending notifications.
- **AWS Lambda:** For scheduled tasks and event-driven functions.
- **AWS Elastic Beanstalk:** For deployment and hosting.
- **AWS CloudWatch:** For monitoring and error handling.
- **JWT (Json Web Token):** For secure authentication.
- **bcrypt:** For password hashing.
- **Nodemon:** For monitoring changes in Node.js applications and automatically restarting the server.
- **Material-UI (MUI):** A popular React UI framework.
- **Formik:** For building forms in React.
- **Recharts:** For data visualization in React.
- **Yup:** For schema validation.
- **React Router:** For routing in React applications.

### Dev Dependencies
- **Nodemon:** A tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
- **Testing Libraries:** Includes Jest, Testing Library, and types for TypeScript support.

## Folder Structure
- **customLibrary/**: Contains the custom TypeScript library used for data handling and simulation.
  - **dist/**: Compiled library code.
  - **src/**: Source code of the custom library.
  - **package.json**: Dependencies and scripts for the custom library.
  - **tsconfig.json**: TypeScript configuration file.

- **webapp/**: Main web application.
  - **backend/**: Node.js and Express backend server.
  - **frontend/**: React frontend application.
  - **lambda-project/**: AWS Lambda functions for scheduled tasks and event-driven processes.
  - **package.json**: Dependencies and scripts for the web application.
  - **Procfile**: For specifying commands that are run by the app on startup (used by Heroku).

## Installation

To run this project locally, follow these steps:

### Prerequisites

- Node.js
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd webapp/backend

2. Install the dependencies:
    ```bash
    npm install

3. Set up the environment variables in the .env file.

4. Start the backend server:
    ```bash
    npm start

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd webapp/frontend

2. Install the dependencies:
    ```bash
    npm install

3. Start the frontend application:
    ```bash
    npm start

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd customLibrary

2. Install the dependencies:
    ```bash
    npm install

3. Build the library:
    ```bash
    npm run build


## Usage
Once the servers are running, you can access the application via http://localhost:3000. Users can sign up, log in, view their energy consumption data, lodge complaints, and download their monthly bills.

## Environment Variables
Ensure you have the necessary environment variables set up. You can find a sample configuration in the .env file. Here are the key variables:

1. `PORT`: Port for the backend server.
2. `AWS_ACCESS_KEY_ID`: AWS access key for accessing AWS services.
3. `AWS_SECRET_ACCESS_KEY`: AWS secret key for accessing AWS services.
4. `JWT_SECRET`: Secret key for JWT authentication.
5. `DYNAMODB_TABLE_USER`: DynamoDB table name for user data.
6. `DYNAMODB_TABLE_COMPLAINT`: DynamoDB table name for complaint data.
7. `DYNAMODB_TABLE_ENERGY`: DynamoDB table name for energy consumption data.
8. `S3_BUCKET`: S3 bucket name for storing bills.

## setup-and-configuration

### Node.js and React.js
1. Initialize the Node.js project:
    ```bash
    npm init

2. Install necessary packages:
    ```bash
    npm install

3. Create a React.js project:
    ```bash
    npx create-react-app appname

### AWS Services Configuration
1. AWS S3: Set up a bucket for storing electricity bills.
2. AWS DynamoDB: Create tables for user data, complaints, and energy consumption.
3. AWS SQS and SNS: Configure for managing and sending notifications.
4. AWS Lambda: Set up functions for handling scheduled tasks and event-driven processes.
5. AWS Elastic Beanstalk: Deploy the frontend and backend applications.


## Operations
1. User Authentication: Secure login and signup using JWT.
2. Data Visualization: Display real-time energy consumption data.
3. Customer Support: Lodge and track complaints with email notifications.
4. Bill Management: Generate and download monthly bills stored in S3.

## Custom Library

A custom library named datapowerutils has been created and published on npm to handle and simulate data efficiently.

### DataSimulator
Simulates realistic data scenarios, particularly for electric consumption models.

### DataTransformer
Provides versatile data sorting functionalities, managing various data types like strings, numbers, and dates.

### Installation of Custom Library
To install the custom library, use the following command:
```bash
npm install powerdatautils
```
For more information and documentation, visit the [powerdatautils](https://www.npmjs.com/package/powerdatautils) npm page.

## Contributing
We welcome contributions from the community. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Commit your changes (git commit -m 'Add some feature').
5. Push to the branch (git push origin feature-branch).
6. Open a Pull Request.

## License
This project is licensed under the MIT License.

