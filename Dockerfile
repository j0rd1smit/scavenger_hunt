FROM node:12
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
#Install the runtime and compile dependencies
RUN npm install
# Bundle app source
COPY . .
#Expose the server port
EXPOSE 80
EXPOSE 443
#Compiles the project.
RUN npm run-script build

#variable
ENV key=""
ENV cert=""

#Starts the server.
CMD npm start -- --key=$key --cert=$cert
