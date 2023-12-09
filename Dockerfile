# Use an official Node.js runtime as the base image
FROM node:20.9.0

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json .
COPY tsconfig.json .
COPY next.config.js .
COPY tailwind.config.ts .

# Install the application dependencies
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Make port 3000 available to the outside of the Docker container
EXPOSE 3000

# Run the application when the container launches
CMD ["npm", "start"]