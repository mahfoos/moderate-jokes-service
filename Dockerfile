FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files to the working directory
COPY . .

# Compile TypeScript code to JavaScript
RUN npm run build

# Expose the necessary port
EXPOSE 3000

# Set the CMD to run the compiled server.js file in the dist folder
CMD ["node", "dist/server.js"]
