# frontend/Dockerfile

# Use a Node.js base image
FROM node:18-alpine 

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if you're using it)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React application for production
RUN npm run build

# Expose the port your React app will run on
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"] 
