# Usage sh deploy.sh [app-name] [iam-lambda-role-arn]

# Create package bundle
mkdir package
pip3 install --target ./package -r requirements.txt
cd package
zip -r ../deployment.zip .
cd ..
zip -g deployment.zip lambda_function.py
zip -g deployment.zip crypto.py

# Deploy to AWS
aws lambda create-function --function-name $1 --zip-file fileb://deployment.zip --handler lambda_function.main --runtime python3.8 --role $2

# Clean-up
rm -rf ./package
rm -f deployment.zip