FROM node:22-alpine

# Install build tools
RUN apk add --no-cache make gcc g++ python3

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Rebuild bcrypt for the Alpine environment
RUN npm rebuild bcrypt --build-from-source

RUN npm run build

# Clean up build tools to reduce image size
RUN apk del make gcc g++ python3

EXPOSE 3000
CMD ["npm", "run", "start:prod"]