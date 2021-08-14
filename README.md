![Test and Deploy](https://github.com/odrusso/jnl/workflows/Deploy%20JNL%20to%20S3%20for%20static%20hosting/badge.svg)  
![jnl-readme-header](https://user-images.githubusercontent.com/15084674/129442900-24daa50f-79b3-491d-860b-de35b7885e36.png)

## https://jnlapp.io/
Pragmatic journaling webapp. No servers, no analytics, no tracking.  

![Screen Shot 2021-08-14 at 10 07 58 PM](https://user-images.githubusercontent.com/15084674/129442607-8915c1f1-32e4-4a9a-9a5a-ccf3eaf96ed1.png)

# Getting started
To run the app with a mocked backend, simply run `npm run start` in the `./web` directory.  
To run the tests, run `cd ./web && npm i && npm run test` and `cd ./app && pip install -r requirements.txt && python -m unittest`.

# Technology
- Frontend written in Typescript, using React in `./web`. Hosted in S3, backed by Cloudfront. A handful of Jest / React Testing Library tests.  
- Simple API written in Python in `./app` running on AWS Lambda, behind an API Gateway. Backed by DynamoDB. A handful of Python unittest tests.  
- All infrastructure spun up with CloudFormation template in `./infrastructure`.  
- Simple CI/CD automation with GitHub Actions, will run tests on branches, and test+deploy on Master.

# Contributing
Feel free to open any PRs or issues. 
