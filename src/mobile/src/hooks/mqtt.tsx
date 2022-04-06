import React, { createContext, useState, useContext, useEffect } from 'react'
import mqtt, {
  IClientOptions,
  IClientPublishOptions,
  IClientSubscribeOptions,
  MqttClient,
  Packet,
  PacketCallback
} from '@taoqf/react-native-mqtt'

import { Buffer } from 'buffer'
global.Buffer = Buffer

interface MqttContextData {
  publish(
    topic: string,
    message: string | Buffer,
    opts: IClientPublishOptions,
    callback: (
      topic_: string,
      payload: Buffer,
      packet: Packet,
      error?: Error
    ) => void
  ): void;
  subscribe(
    topic: string | string[],
    opts: IClientSubscribeOptions,
    callback?: (
      topic_: string,
      payload: Buffer,
      packet: Packet,
      error: Error
    ) => void
  ): void;
  unsubscribe(
    topic_: string | string[],
    opts?: Record<string, unknown> | undefined,
    callback?: PacketCallback | undefined
  ): MqttClient;
  onMessage(
    topic_: string, payload: Buffer, packet: Packet
  ): void;
  configureBroker(
    config: MqttProps
  ): void
  clientMqtt: MqttClient;
  payload: Buffer
}

export interface MqttProps {
  brokerUrl?: string;
  options: IClientOptions;
}

interface MqttProviderProps {
  mqttProps: MqttProps;
  children?: React.ReactNode;
}

const MqttContext = createContext<MqttContextData>({} as MqttContextData)

export const MqttProvider = ({ children, mqttProps }: MqttProviderProps): JSX.Element => {
  const [clientMqtt, setClientMqtt] = useState<MqttClient>(() =>
    mqtt.connect(mqttProps.brokerUrl, mqttProps.options)
  )
  const [payload, setPayload] = useState<Buffer>()

  useEffect(() => {
    clientMqtt.on('connect', (packet: Packet) => {
      console.log('CONNECTED')
    })

    clientMqtt.on('reconnect', (a: any, b: any) => {
      console.log('Reconnecting', a, b)
    })

    clientMqtt.on('error', (err) => {
      console.error('Connection error: ', err)
      clientMqtt.end()
    })

    clientMqtt.on('end', () => {
      console.log('Connection Ended')
      clientMqtt.end()
    })

    clientMqtt.on('disconnect', (packet: Packet) => {
      console.error('Disconnecting: ', packet)
      clientMqtt.end()
    })
    clientMqtt.on('message', (topic_: string, payload: Buffer, packet: Packet) => onMessage(topic_, payload, packet))
  }, [clientMqtt])
  const unsubscribe =(
    topic_: string | string[],
    opts?: Record<string, unknown> | undefined,
  ): MqttClient => {
    clientMqtt.unsubscribe(topic_, { ...opts })
    return clientMqtt
  }

  const publish = (
    topic: string,
    message: string | Buffer,
    opts: IClientPublishOptions,
    callback: (
      topic_: string,
      payload: Buffer,
      packet: Packet,
      error?: Error
    ) => void
  ) => {
    clientMqtt.publish(topic, message, opts, (error, packet) => {
      console.log('error', error)
      clientMqtt.on(
        'message',
        (topic_: string, payload: Buffer, packet_: Packet) => {
          callback(topic_, payload, packet_, error)
        }
      )
    })
  }

  const subscribe = (
    topic: string | string[],
    opts: IClientSubscribeOptions,
  ) => {
    clientMqtt.subscribe(topic, { ...opts })
  }

  const onMessage = (topic_: string, payload: Buffer, packet: Packet): void => {
    setPayload(payload)
  }

  const configureBroker = (config: MqttProps): void => {
    clientMqtt.end(true)
    setClientMqtt(() => mqtt.connect(config.brokerUrl, config.options))
  }

  return (
    <MqttContext.Provider
      value={{
        publish,
        subscribe,
        unsubscribe,
        onMessage,
        clientMqtt,
        configureBroker,
        payload: payload as Buffer,
      }}
    >
      {children}
    </MqttContext.Provider>
  )
}

export function useMqtt(): MqttContextData {
  const context = useContext(MqttContext)

  if (!context) {
    throw new Error('useMqtt must be used within an MqttProvider')
  }

  return context
}