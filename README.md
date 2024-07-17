# Customer Data Management

Building a user-friendly mobile interface that enables the seamless creation and management of customer objects in a database

## Prerequisites
* Node.js and Yarn
* Android Emulator / iOS Simulator
* Docker Desktop

## Technologies Used
* React Native for Frontend
* Nodejs with Express for Backend
* Postgres DB, Image hosted using Docker
* Prisma ORM to simplify DB interaction

## Monorepo Structure
```bash
├── docker-compose.yml----------------> Postgres DB config and Docker image data
├── package.json----------------------> Dependencies
└── packages
    ├── backend-----------------------> Nodejs repo for backend implementation
    │   ├── prisma--------------------> Prisma configuration including models
    │   └── src
    └── mobile------------------------> Mobile App Code
```
## Installation

* From the root folder, use the following command to install all dependencies
```bash
yarn install
```
* To download and host the Postgres Image using Docker
```bash
yarn start:db
```
* To generate the Prisma Client and update the DB schema
```bash
yarn start:prisma
```
* To start the Nodejs server
```bash
yarn start:backend
```
* To start the mobile app
```bash
yarn start:mobile
```
* Based on your preference, enter `a` for Android emulator or `i` for iOS Simulator. Please note, in order for this to work, the AVDs and Simulators must have been downloaded and the necessary SDKs installed

## Environment File
* Create a `.env` file in the backend folder and enter the values for `DATABASE_URL` and `secretKey` used by JWT

## Roadmap

* Sanitize Requests to prevent Cross-Site Scripting (XSS), SQL injection, and NoSQL injection attacks
Found a JavaScript Package ([perfect-express-sanitizer](https://www.npmjs.com/package/perfect-express-sanitizer)) to achieve this, should find something similar in Typescript to achieve this
* Move the JWT token verification to an interceptor, and use it for all APIs