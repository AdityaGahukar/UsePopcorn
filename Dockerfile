# Use an official Node.js runtime as the base image
FROM node:18-alpine 

# Set the working directory inside the container
WORKDIR /app 

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./ 

# Install dependencies
RUN npm install 

# Copy the rest of the application files
COPY . . 

# Build the React app
RUN npm run build 

# Serve the app using a lightweight web server
RUN npm install -g serve 

# Expose the port where the app will run
EXPOSE 3000 

# Define the command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]
