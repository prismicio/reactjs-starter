[![Dependency Status](https://david-dm.org/prismicio/reactjs-starter.svg)](https://david-dm.org/prismicio/reactjs-starter)

# Prismic React Starter
This project has been created with [`create-react-app`](https://github.com/facebookincubator/create-react-app). We added a zest of [prismic](https://github.com/prismicio/javascript-kit) inside it. It serves as a boilerplate React+Prismic application that will serves as a quick guide to get your own applications off the ground

## Quick bootstrap
The fastest way to run get started from scratch is using the Prismic command line tool to install the starter codebase, create a new Prismic repository and setup the Page custom type with only a few commands.
```bash
npm install -g prismic-cli
prismic new
```
Select a name for your new Prismic repository, the local folder for your project and finally select `React` to bootstrap the React.js starter project. The dependencies will be installed as well, so once the process is done, just navigate to the folder and run the app with `npm start`

Follow along with the Help's page instructions. You can safely ignore the instructions in the first two steps regarding creating a new repository and the Page custom type, the Prismic tool has taken care of that for you.

## Running the app in the development mode
Run the following command to launch the project in dev mode:
```
npm start
```
Then you can open your browser to http://localhost:3000.

## Building the app for production
Run the following command to create an optimized build of your site:
```
npm run build
```

## Deployment
This project is ready for deployment using [Netlify](https://www.netlify.com), thanks to the addition of a `_redirects` file located in the public folder. If you're interested in deploying to other platforms review the suggested [solutions](https://facebook.github.io/create-react-app/docs/deployment).

## Learn more about Prismic

You can find out more about how to use React.js with Prismic from [our React documentation](https://prismic.io/docs/reactjs/getting-started/getting-started-from-scratch).

## Licence

This software is licensed under the Apache 2 license, quoted below.

Copyright 2019 Prismic (https://prismic.io).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
