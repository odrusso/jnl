## Infra creation
1. **Deploy Route53 Hosted Zone CF (_dns.cf.json_)** 
   1. Get the NS servers from the deployed R53 zone, and then create a new record set on the root account with an NS record pointing to those NS servers
2. **Deploy FE CF (_spa.cf.yaml_)** 
   1. As it's deploying, add FE DNS records from SSL certificate to Route53 Hosted Zone 
3. **Deploy API CF (_api-s3.cf.yaml & api.cf.yaml_)** 
   1. First deploy the S3 template, and upload a `deployment.zip` file to it
   2. As it's deploying, Add BE DNS records from SSL certification to Route53 Hosted Zone
4. Then run a stage deploy through Github Actions
## Infra deletion
1. Delete all manually created HostedZone DNS record for SSL certificates
2. Delete all objects in S3 buckets (inc. all version)
3. Delete all CF stacks
