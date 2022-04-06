#ifndef WAGNER_H
#define WAGNER_H

#include <Motor.h>
#include <Action.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>

#define WIFI_SSID "SSID_HERE"
#define WIFI_PASSWORD "PASSWORD_HERE"

#define UART_METHODS_NUMBER 1
#define UART_BLUETOOTH_ID 0
#define UART_START_MARKER '<'
#define UART_END_MARKER '>'
#define UART_PROTOCOL_STRING_LENGTH 7
#define UART_PROTOCOL_STRING_DELIMITER '#'
#define UART_PROTOCOL_STRING_CURRENT_DIRECTION "CR"

#define CONVERT_CODE_TO_ID(code) ((code/2)-101)

#define ACTION_STOP 0
#define ACTION_WALK_FORWARD 1
#define QNT_DEFAULT_ACTIONS 6

#define CONST_MAX_SPEED_VALUE 1023
#define CONST_CN_MAX_DISTANCE 15.0
#define CONST_CN_BLOCKED_TIME_IN_MS 2000
#define CONST_CN_WALKING_TIME_IN_MS 2000
#define CONST_PRINT_WIFI_STATUS_IN_MS 3000


class Wagner {

private:
	int direction; 
	Motor *motors;
	unsigned int motors_length;
	Action *default_actions;
	Action *current_action;
	bool current_action_changed;
	int decision;
	bool recalculating_route;
	unsigned long last_millis;

	void random_decision_side();
	void write();
	void setCurrentAction(Action*);

public:
	Wagner(unsigned int,Motor*);
	bool wifiConnected();
	String getMacAddress();
	IPAddress getLocalIP();
	void printWifiStatus();
	void drive(long);
	void handleProtocolStringChanged(String);
	void handleUARTByteReceived(byte,byte);

};


#endif