# Usage sh update.sh [app-name]

# Create package bundle
zip -r ./deployment.zip .

# Redeploy to AWS
aws lambda update-function-code --function-name $1 --zip-file fileb://deployment.zip

# Clean-up
rm -rf ./package
rm -f deployment.zip
