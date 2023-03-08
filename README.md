Hello Asteroids!

The Challenge:
Create a reactive single page web app that displays a paginated table listing near earth objects
within a selectable timeframe using the nasa NeoWs API https://api.nasa.gov/.
● The page should allow the entry of start and end dates.
● The page should then display the following information:Name, estimated diameter, is it
a potentially hazardous asteroid, is it a sentry object
● It must have the ability to select or click on an object and then show the next 5 and
previous 5 approaches to Earth.

To run this application:
- clone this repo
- npm install in the root directory
- generate your own API Key at https://api.nasa.gov/#signUp or use DEMO_KEY in place of API_KEY variable in the network calls
- npm start

I focussed on the happy path but next steps and things to improve are:
- have the end date date-picker know about the start date that has been entered
- error messaging to the user if the range limit is exceeded
- refactoring into smaller and more reusable components
