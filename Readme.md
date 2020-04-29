# GraphQL + Prisma2 + Serverless + AWS

## Requirements

* AWS Account
* Serverless Framework
* Cloudinary Account
* MySQL Database

## Installing

- Run ``` npm install ```.
- Create a database and import db.sql file to create tables.
- Create env.yml following env.example.yml and fill variables. 
- Run  ``` npx prisma generate ```.


## Usage

- Make sure to have installed Serverless globally (npm install -g serverless) and login with your account (serverless login).
- Test locally with ``` serverless offline ```.
- Deploy to AWS with ``` serverless deploy ```.



