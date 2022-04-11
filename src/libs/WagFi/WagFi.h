#ifndef WAG_FI_H
#define WAG_FI_H

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ConnectionManager.h>

#define PRINT_STATUS_IN_MS 3000


class WagFi : public ConnectionManager {

private:
  char* ssid;
  char* password;

protected:
  void connect();

public:
  WagFi(char*,char*);
  bool connected();
	String getMacAddress();
	IPAddress getLocalIP();
	void printStatus();

};


#endif