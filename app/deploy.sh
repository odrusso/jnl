#jnl-app-role-nzvrmxtp

# Create package bundle
mkdir package
pip3 install --target ./package -r requirements.txt
cd package
zip -r ../deployment.zip .
cd ..
zip -g deployment.zip lambda_function.py

# Deploy to AWS
aws lambda create-function --function-name jnl-app --zip-file fileb://deployment.zip --handler lambda_function.main --runtime python3.8 --role arn:aws:iam::890038740915:role/service-role/jnl-app-role-nzvrmxtp

# Clean-up
rm -rf ./package
rm -f deployment.zip