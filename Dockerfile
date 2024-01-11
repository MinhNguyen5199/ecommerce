# Build Stage
FROM node:20.9.0-alpine AS build
WORKDIR /app

# Copy only the necessary files for dependency installation
COPY package.json .
COPY tsconfig.json .
COPY next.config.js .
COPY tailwind.config.ts .

# Install the application dependencies
RUN npm install --force

# Copy only the necessary files for building the application
COPY . .

# Generate Prisma client and build the application
RUN npx prisma generate && npm run build

# Production Stage
FROM node:20.9.0-alpine
WORKDIR /app

# Copy only the necessary artifacts from the build stage
COPY --from=build /app /app

# Expose port 3000
EXPOSE 3000

# Run the application
CMD ["npm", "start"]