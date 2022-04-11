#ifndef MQTT_H
#define MQTT_H

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ConnectionManager.h>

struct mqtt_connection_credentials_t {
  unsigned int port;
  char* host;
  char* clientId;
  // to-do: auth credentials (user & password)
};

typedef struct mqtt_connection_credentials_t MqttConnectionCredentials;
typedef void CallbackFunction(char*,byte*,unsigned int);


class Mqtt : public ConnectionManager {
  
private:
  PubSubClient* client;
  MqttConnectionCredentials* connection;

protected:
  void connect();

public:
  Mqtt(MqttConnectionCredentials*,CallbackFunction*);
  bool connected();

};


#endif