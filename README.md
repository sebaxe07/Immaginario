# Immaginario

Immaginario remade - An app project for the course 097685 - Advanced User Interfaces. The Immaginario application is an improved version of an already existing mobile application that was developed by a company of therapists called Finger Talks in 2013. The application is designed to be an educational tool to improve the language skills for children with ASD (autism spectrum disorder). 


### 📄 - Requirements

The needs of the application is supporting communication toward autistic people to make them easier to understand and participate in social interactions. 

The goal of the project is to develop a revised version of the previous Immaginario application, improve its current functionalities and integrate new features to facilitate answering simple questions.


### 🔨 - Developer info

Nine developers from three groups from the AUI course have been working on the project. 

### 👔 - Customer

The customer of the application are a group of therapists from Finger Talks, and throughout the development process the team has had several 
meetings to understand their needs and goals for the application.
Visit [Finger Talks](https://www.fingertalks.it/) to read more about the customer.


### Code Layout
The application is divided into two main parts, using a client-server architecture.


```plaintext
immaginario
├── .expo
│   └── [Expo configuration files]
├── .github
│   └── workflows
│       └── [GitHub Actions workflow files]
├── assets
│   └── [Static assets, images and icons]
├── node_modules
│   └── [Dependencies installed by npm]
├── src
│   ├── components
│   │   └── [React components]
│   ├── config
│   │   └── [Configuration files]
│   ├── context
│   │   └── [React context files]
│   ├── hooks
│   │   └── [Custom React hooks]
│   ├── layout
│   │   └── [Layout components]
│   ├── lib
│   │   └── [Library code]
│   ├── providers
│   │   └── [Context providers]
│   ├── schema
│   │   └── [Data schemas]
│   ├── services
│   │   └── [Service files, API calls]
│   ├── state
│   │   └── [State management files]
│   ├── types
│   │   └── [TypeScript types definition files]
│   ├── utils
│   │   └── [Utility functions]
│   └── views
│       └── [View components]
├── .eslintrc.json
├── .gitignore
├── .prettierignore
├── .prettierrc
├── app.json
├── App.tsx
├── babel.config.js
├── colors.js
├── declarations.d.ts
├── global.d.ts
├── metro.config.js
├── package-lock.json
├── package.json
├── README.md
├── tailwind.config.js
└── tsconfig.json


```

### Running the application 

## Setup Dependencies

Requirements: 
- [Node + npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Running the application: 
```bash
npm install
npm start
```
To run the react native application install [Expo Go](https://expo.dev/client) on your IOS or Android phone and connect to the same wireless network as your computer. Scan the QR code from your terminal to open the project.


### Technology Stack
The technology stack was chosen based on the requirements and the analysis of the problem. The team has chosen to recreate the already existing iOS application, but in a more modern and cross-compatible platform, [React Native](https://reactnative.dev).
React Native is a framework for developing a single mobile application for both iOS and Android using the same codebase.
The framework of the application is [Expo](https://expo.dev), the codebase is written in [TypeScript](https://www.typescriptlang.org) and [Firebase](https://firebase.google.com) is used as the backend for the project. 

Libraries: 
- [React Navigation](https://reactnavigation.org): Library to support the navigation between different screens in the application.
- [React Native Paper](https://reactnativepaper.com): Material design component library. 
- [NativeWind](https://www.nativewind.dev): Style library to style the components with Tailwind CSS. 





