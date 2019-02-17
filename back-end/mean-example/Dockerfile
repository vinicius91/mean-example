# base image
FROM node:10.14.2

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app


# install and cache app dependencies
COPY ./back-end/mean-example/package.json /usr/src/app/package.json
RUN yarn


# start app
CMD ["yarn", "start:dev"]
