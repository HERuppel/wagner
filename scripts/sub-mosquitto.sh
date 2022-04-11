#!/bin/bash

PORT="1883"
HOST="broker.hivemq.com"
TOPIC_PREFIX="Sistemas.Embarcados.Wagner."

TOPIC="$1"

mosquitto_sub \
 -h ${HOST} \
 -p ${PORT} \
 -t ${TOPIC_PREFIX}${TOPIC}
