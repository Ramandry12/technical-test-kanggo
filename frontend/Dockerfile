FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the frontend files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
CMD ["yarn", "dev"]
