# Usage sh deploy.sh [app-name] [iam-lambda-role-arn]

# Create package bundle
zip -r ./deployment.zip .

# Deploy to AWS
aws lambda create-function --function-name $1 --zip-file fileb://deployment.zip --handler lambda_function.main --timeout 30 --runtime python3.8 --role $2

# Clean-up
rm -f deployment.zip
