# 1. Start from a lightweight Linux OS with Node 18 installed
FROM node:18-alpine

# 2. Create a folder inside the container
WORKDIR /app

# 3. Copy package.json FIRST (for caching)
# We do this before copying the rest of the code so Docker doesn't 
# re-install node_modules every time we change a single line of code.
COPY package*.json ./

# 4. Install dependencies inside the container
RUN npm install

# 5. Copy the rest of your source code
COPY tsconfig.json ./
COPY . .

# Build the TypeScript code
RUN npm run build

# 6. Expose the port (Documentation only, doesn't actually open it)
EXPOSE 5001

# 7. The command to start the app
CMD ["node", "dist/index.js"]