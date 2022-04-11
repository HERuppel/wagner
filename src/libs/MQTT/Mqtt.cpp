#include "Mqtt.h"


Mqtt::Mqtt(MqttConnectionCredentials* connection, CallbackFunction* callback) {
	this->connection = connection;

	WiFiClient _wifiClient;
	PubSubClient _pbClient = PubSubClient(_wifiClient);
  this->client = &_pbClient;

  this->client->setServer(this->connection->host, this->connection->port);
  this->client->setCallback(callback);
}

void Mqtt::connect() {
	if (this->client->connect(this->connection->clientId)) {
		this->client->subscribe("to-do");
	}
}

bool Mqtt::connected() {
	return this->client->connected();
}