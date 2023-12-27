# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Install AWS SAM CLI
RUN pip install aws-sam-cli

# Copy the current directory contents into the container
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port used by AWS SAM CLI
EXPOSE 3000

# Run the AWS SAM local API
CMD ["sam", "local", "start-api", "--host", "0.0.0.0", "--port", "3000"]
