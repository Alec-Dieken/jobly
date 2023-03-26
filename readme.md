# Jobly - Job Board Express App

Jobly is a job board application built using Express.js. It allows users to browse companies and job listings, as well as apply for jobs.

## Table of Contents
- [Installation](#installation)
- [API Endpoints](#api)
    - [Companies](#companies)
    - [Jobs](#jobs)
    - [Users](#jobs)
- [Tests](#tests)

## Installation
1. Clone this repository:
```
git clone https://github.com/yourusername/jobly.git

cd jobly
```

2. Install dependencies:
```
npm install
```

3. Create the database:
```
createdb jobly

createdb jobly-test
```

4. Run the server:
```
npm start
```
The server will start on port 3001 by default. You can now access the API at http://localhost:3001.

## API Endpoints
### Companies
- `GET /companies`: Get a list of all companies.