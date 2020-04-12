FROM node:8
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
#Install the runtime and compile dependencies
RUN npm install
# Bundle app source
COPY . .
#Expose the server port
EXPOSE 8080
#Compiles the project.
RUN npm run-script build
#Starts the server.
CMD npm start
