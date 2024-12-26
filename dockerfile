# Use the official Node.js image as a base
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first to take advantage of Docker's cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code (including dist or build folder) into the container
# Make sure the dist folder is generated before this step in your build process
COPY . .

# Build the project (this step is required if you need to generate the dist folder)
RUN npm run build

# Expose the port your app will run on
EXPOSE 8000

# Set environment variables (these can also be set at runtime using -e flags in the `docker run` command)
# If you are using GitHub secrets, they will be passed during the GitHub Actions workflow.
ENV PORT=8000
ENV DB_URL=${DB_URL}
ENV CROSS_ORIGIN=${CROSS_ORIGIN}
ENV JWT_SECRET=${JWT_SECRET}

# Command to run your app inside the container (this assumes your built app is in dist/)
CMD ["node", "dist/index.js"]
