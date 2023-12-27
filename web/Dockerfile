FROM node:slim

# Copy the current directory contents into the container
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Expose the port used by AWS SAM CLI
EXPOSE 8080

# Run the AWS SAM local API
CMD ["npm", "run", "start-docker"]
