# Use the official Node.js image as a base
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first to take advantage of Docker's cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the dist folder (or the build folder) into the container
COPY dist/ /app/dist/

# Expose the port your app will run on
EXPOSE 8000

# Set environment variables (this can also be done at runtime with -e flags)
ENV PORT=8000
ENV DB_URL=${DB_URL}
ENV CROSS_ORIGIN=${CROSS_ORIGIN}
ENV JWT_SECRET=${JWT_SECRET}

# Command to run your app inside the container
CMD ["node", "dist/app.js"]
