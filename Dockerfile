# Use an official Node runtime as a parent image
FROM node:20-alpine as build

ENV NODE_ENV production
ENV REACT_APP_API_URL /api    

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code to the container
COPY . .
# Build the React app
RUN npm run build


# Use an official Nginx runtime as a parent image
FROM nginx:1.25.4

# Copy the React app build files to the container
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80 for Nginx
EXPOSE 80
EXPOSE 443
# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]


# docker build -t viethungdev23/frontend-react -f .\Dockerfile.prod .