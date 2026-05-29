FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Install openssl and netcat (which is part of busybox in alpine) for Prisma and database checks
RUN apk add --no-cache openssl

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Generate the Prisma 7 Client
RUN yarn prisma generate

# Expose port 5001
EXPOSE 5001

# Command to wait for DB, run migrations, and start development server
CMD ["sh", "-c", "export DATABASE_URL=$(echo $DATABASE_URL | sed 's/localhost/db/') && until nc -z -v -w30 db 3306; do echo 'Waiting for database on port 3306...'; sleep 2; done && yarn prisma migrate dev --name init && yarn dev"]
