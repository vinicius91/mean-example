# base image
FROM node:10.14.2

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY ./back-end/mean-example/package.json /usr/src/app/package.json
RUN npm install --silent


# start app
CMD ["npm", "run", "start:dev"]
