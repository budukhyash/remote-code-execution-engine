FROM ubuntu:16.04
RUN apt-get update -y
RUN apt-get install curl vim sudo build-essential -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install nodejs -y
RUN node -v
RUN npm -v

COPY . .
RUN mkdir temp
RUN chmod 700  /
RUN chmod 755 -R temp/
RUN adduser --disabled-password --gecos "" judge
RUN cd app && npm install
CMD cd app &&  npm start 
