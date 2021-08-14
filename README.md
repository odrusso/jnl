![jnl-readme-header](https://user-images.githubusercontent.com/15084674/129442900-24daa50f-79b3-491d-860b-de35b7885e36.png)

![Deploy JNL to S3 for static hosting](https://github.com/odrusso/jnl/workflows/Deploy%20JNL%20to%20S3%20for%20static%20hosting/badge.svg)  
Pragmatic journelling webapp. No servers, no analytics, no tracking.  
hosted at https://jnlapp.io/

![Screen Shot 2021-08-14 at 10 07 58 PM](https://user-images.githubusercontent.com/15084674/129442607-8915c1f1-32e4-4a9a-9a5a-ccf3eaf96ed1.png)

## Stack
React, hosted from S3 behind AWS CloudFront.  
AWS Fargate API, trigged by AWS API Gateway, stored in an AWS DynamoDB.  
Github Actions will automatically deploy code from Master to this S3 bucket.
