#include "Wagner.h"


Wagner::Wagner(unsigned int lm, Motor* motors) {
	this->recalculating_route = false;
	this->direction = 1;
	this->decision = -1;

	this->motors = motors;
	this->motors_length = lm;

	this->default_actions = new Action[QNT_DEFAULT_ACTIONS] {
		Action(lm, new byte[lm] {0,0}),
		Action(lm, new byte[lm] {100,100}),
		Action(lm, new byte[lm] {0,100}),
		Action(lm, new byte[lm] {100,0}),
		Action(lm, new byte[lm] {60,100}),
		Action(lm, new byte[lm] {100,60})
	};

	this->setCurrentAction(&this->default_actions[ACTION_WALK_FORWARD]);
}

void Wagner::handleUARTByteReceived(byte uart_id, byte received) {
	if (uart_id < 0 || uart_id >= UART_METHODS_NUMBER) {
		Serial.println("ERROR -> void Wagner::handleUARTByteReceived(byte,byte): uart_id out of range");
		return;
	}

	static bool in_progress[UART_METHODS_NUMBER] = {false,false};
	static byte index[UART_METHODS_NUMBER] = {0,0};
	static char received_chars[UART_METHODS_NUMBER][UART_PROTOCOL_STRING_LENGTH];

	if (in_progress[uart_id]) {
		if (received != UART_END_MARKER) {
			received_chars[uart_id][index[uart_id]] = received;
			if ((++index[uart_id]) >= UART_PROTOCOL_STRING_LENGTH) {
				index[uart_id] = UART_PROTOCOL_STRING_LENGTH - 1;
			}
		} else {
			received_chars[uart_id][index[uart_id]] = '\0';
			in_progress[uart_id] = false;
			index[uart_id] = 0;

			this->handleProtocolStringChanged(received_chars[uart_id]);
		}
	} else if (received == UART_START_MARKER) {
		in_progress[uart_id] = true;
	}
}

void Wagner::handleProtocolStringChanged(String value) {
	if (value.indexOf(UART_PROTOCOL_STRING_DELIMITER) == -1) {
		Serial.println("ERROR -> void Wagner::handleProtocolStringChanged(String): invalid protocol string");
		return;
	}

	String direction = value.substring(0, value.indexOf(UART_PROTOCOL_STRING_DELIMITER));
	if (direction.length() == 2) {
		int direction_converted = direction.toInt();
		if (CONVERT_DIRECTION_TO_ID(direction_converted)) {
			this->direction = direction_converted;
		}
	} else {
		Serial.println("ERROR -> void Wagner::handleProtocolStringChanged(String): invalid direction");
		return;
	}

	String code = value.substring(value.indexOf(UART_PROTOCOL_STRING_DELIMITER)+1, value.length());
	if (code.length() == 3) {
		int index = CONVERT_CODE_TO_ID(code.toInt());
		if (index < 0 || index >= QNT_DEFAULT_ACTIONS) {
			Serial.println("ERROR -> void Wagner::handleProtocolStringChanged(String): index out of range");
			return;
		}

		this->setCurrentAction(&this->default_actions[index]);
	} else {
		Serial.println("ERROR -> void Wagner::handleProtocolStringChanged(String): invalid cod");
		return;
	}
}

void Wagner::setCurrentAction(Action* action)  {
	this->current_action_changed = true;
	this->current_action = action;
}

void Wagner::random_decision_side() {
	this->decision = random(4, 6);
	this->direction = -1;
}

void Wagner::write() {
	if (!this->current_action_changed) return;

	byte vcc, gnd, percentage;

	for (int i=0 ; i<this->motors_length ; i++) {
		percentage = this->current_action->getPercentage(i);

		if (percentage == 0) {
			vcc = LOW;
			gnd = LOW;
		} else {
			if (this->direction == 1) {
				vcc = HIGH;
				gnd = LOW;
			} else {
				vcc = LOW;
				gnd = HIGH;
			}
		}

		digitalWrite(this->motors[i].getPinVcc(), vcc);
		digitalWrite(this->motors[i].getPinGnd(), gnd);
		
		analogWrite(
			this->motors[i].getPinSpeedControl(), 
			CONST_MAX_SPEED_VALUE * ((float)percentage/100)
		);
	}

	this->current_action_changed = false;
}

void Wagner::drive(long ultrasonic_value) {
	
	if (ultrasonic_value <= CONST_CN_MAX_DISTANCE && !this->recalculating_route) {
		this->setCurrentAction(&this->default_actions[ACTION_STOP]);
		this->last_millis = millis();
		this->random_decision_side();
		this->recalculating_route = true;
	}

	if (this->recalculating_route) {
		if ((millis() - this->last_millis) >= CONST_CN_BLOCKED_TIME_IN_MS) {
			this->setCurrentAction(&this->default_actions[this->decision]);
		
			if ((millis() - this->last_millis) >= CONST_CN_BLOCKED_TIME_IN_MS + CONST_CN_WALKING_TIME_IN_MS) {
				this->setCurrentAction(&this->default_actions[ACTION_STOP]);
				
				if ((millis() - this->last_millis) >= 2 * CONST_CN_BLOCKED_TIME_IN_MS + CONST_CN_WALKING_TIME_IN_MS) {
					this->setCurrentAction(&this->default_actions[ACTION_WALK_FORWARD]);
					this->direction = 1;
					this->recalculating_route = false;
				}
			}
		}
	}

	this->write();
}