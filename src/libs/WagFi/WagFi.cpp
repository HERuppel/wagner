#include "WagFi.h"


WagFi::WagFi(char* ssid, char* password) {
	this->ssid = ssid;
	this->password = password;
}

void WagFi::connect() {
  WiFi.begin(this->ssid, this->password);
}

bool WagFi::connected() {
	return WiFi.status() == WL_CONNECTED;
}

IPAddress WagFi::getLocalIP() {
	return WiFi.localIP();
}

String WagFi::getMacAddress() {
	return WiFi.macAddress();
}

void WagFi::printStatus() {
	static unsigned long lmillis = millis();
	
	if ((millis() - lmillis) >= PRINT_STATUS_IN_MS) {
		Serial.println("=====================================");
		Serial.print("Status da conexão wi-fi: ");
		Serial.println(this->connected()? "CONECTADO" : "DESCONECTADO");
		Serial.println("=====================================");
		
		lmillis = millis();
	}
}