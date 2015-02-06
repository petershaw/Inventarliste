#!/bin/bash

docker run \
	--name inventar-mongo \
	-v /data/db:/data/db
	-d mongo

docker run \
	-p 8080:8080 \
	--link inventar-mongo:mongo \
	--name inventar \
	-d -i -t website
	
