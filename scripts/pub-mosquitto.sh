#!/bin/bash

PORT="1883"
HOST="broker.hivemq.com"
TOPIC_PREFIX="Sistemas.Embarcados.Wagner."

TOPIC="$1"
VALUE="$2"

[[ "${TOPIC}" == "Velocity" ]] \
  && CODE=$VALUE \
  || CODE=$(cat ./actions | grep ${VALUE}: | awk -F: '{print $2}')

echo "Publicando:" $CODE "no topico:" ${TOPIC_PREFIX}${TOPIC}

mosquitto_pub \
 -h ${HOST} \
 -p ${PORT} \
 -t ${TOPIC_PREFIX}${TOPIC} \
 -m ${CODE}