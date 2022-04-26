#include <Motor.h>
#include <Ultrasonic.h>
#include <Wagner.h>
#include <Bluetooth.h>
#include <WagFi.h>

#include <PubSubClient.h>

#define QNT_MOTORS 2

#define ULTRASONIC_TRIGGER_PIN 4
#define ULTRASONIC_ECHO_PIN 5

#define MOTOR_01_VCC_PIN 13
#define MOTOR_01_GND_PIN 15
#define MOTOR_01_PWM_PIN 2

#define MOTOR_02_VCC_PIN 14
#define MOTOR_02_GND_PIN 12
#define MOTOR_02_PWM_PIN 0

#define BLUETOOTH_RX 3
#define BLUETOOTH_TX 1

#define WIFI_SSID "SSID_HERE"
#define WIFI_PASSWORD "PASSWORD_HERE"


/*
	PROTOTYPES
*/
void conectaMQTT();
void onMQTTMessageCallback(char*,byte*,unsigned int);


/*
	GLOBALS OBJECTS/VARS
*/
WagFi wagfi = WagFi(WIFI_SSID, WIFI_PASSWORD);
Bluetooth bluetooth = Bluetooth(BLUETOOTH_RX, BLUETOOTH_TX);
Ultrasonic ultrasonic = Ultrasonic(
	ULTRASONIC_TRIGGER_PIN, ULTRASONIC_ECHO_PIN
);
Wagner wagner = Wagner(
	QNT_MOTORS, 
	new Motor[QNT_MOTORS] {
		Motor(MOTOR_01_VCC_PIN, MOTOR_01_GND_PIN, MOTOR_01_PWM_PIN),
		Motor(MOTOR_02_VCC_PIN, MOTOR_02_GND_PIN, MOTOR_02_PWM_PIN)
	}
);

WiFiClient clienteWIFI;
PubSubClient clienteMQTT(clienteWIFI);

void setup() {
	Serial.begin(9600);
	randomSeed(analogRead(A0));

	clienteMQTT.setServer("broker.mqtt-dashboard.com", 1883);
  clienteMQTT.setCallback(onMQTTMessageCallback);
}

void loop() {

  /*
	long microsec = ultrasonic.timing();
	float distance_in_cm = ultrasonic.convert(microsec, Ultrasonic::CM);

		
	Serial.print("LOG loop -> distance_in_cm == ");
	Serial.print(distance_in_cm);
	Serial.println("cm");
  */
		
	if (!wagfi.connected()) {
		wagfi.reconnect();
	} else {
		if (!clienteMQTT.connected()) {
			conectaMQTT();
		}
	}

	clienteMQTT.loop();

	if (bluetooth.available()) {
		wagner.handleUARTByteReceived(UART_BLUETOOTH_ID, bluetooth.getCurrentByte());
	}

	wagner.drive(100.0);

	delay(50);
}

void onMQTTMessageCallback(char* topic, byte* payload, unsigned int size) {
  Serial.print("[MSG RECEBIDA] Topico: ");
  Serial.print(topic);
  Serial.print(" / Mensagem: ");
  for (int i = 0; i < size; i++) {
    Serial.print((char)payload[i]);
		wagner.handleUARTByteReceived(UART_MQTT_ID, payload[i]);
  }
  Serial.println();
}

void conectaMQTT() {
	if (clienteMQTT.connect("clienteWIFI" +  random(300))) {
		Serial.println("MQTT conectado");
		clienteMQTT.subscribe("Sistemas.Embarcados.Wagner.Actions");
    clienteMQTT.subscribe("Sistemas.Embarcados.Wagner.Speed");
	} else {
		Serial.print("Falha, rc=");
		Serial.print(clienteMQTT.state());
	}
}
