#ifndef WAGNER_H
#define WAGNER_H

#include <Motor.h>
#include <Action.h>
#include <Arduino.h>

#define UART_METHODS_NUMBER 2
#define UART_BLUETOOTH_ID 0
#define UART_MQTT_ID 1
#define UART_START_MARKER '<'
#define UART_END_MARKER '>'
#define UART_PROTOCOL_STRING_LENGTH 9
#define UART_PROTOCOL_STRING_DELIMITER '#'

#define CONVERT_CODE_TO_ID(code) ((code/2)-101)
#define CONVERT_DIRECTION_TO_ID(direction) (20-direction)

#define ACTION_STOP 0
#define ACTION_WALK_FORWARD 1
#define QNT_DEFAULT_ACTIONS 6

#define MIN_SPEED_DELIMITER 500
#define MAX_SPEED_DELIMITER 600

#define CONST_MAX_SPEED_VALUE 1023
#define CONST_CN_MAX_DISTANCE 15.0
#define CONST_CN_BLOCKED_TIME_IN_MS 2000
#define CONST_CN_WALKING_TIME_IN_MS 2000


class Wagner {

private:
	byte speed;
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
	void setCurrentSpeed(byte);

public:
	Wagner(unsigned int,Motor*);
	void drive(long);
	void handleProtocolStringChanged(String);
	void handleUARTByteReceived(byte,byte);

};


#endif