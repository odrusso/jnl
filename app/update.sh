# Usage sh update.sh [app-name]

# Create package bundle
mkdir package
pip3 install --target ./package -r requirements.txt
cd package
zip -r ../deployment.zip .
cd ..
zip -g deployment.zip lambda_function.py
zip -g deployment.zip crypto.py

# Redeploy to AWS
aws lambda update-function-code --function-name $1 --zip-file fileb://deployment.zip

# Clean-up
rm -rf ./package
rm -f deployment.zip