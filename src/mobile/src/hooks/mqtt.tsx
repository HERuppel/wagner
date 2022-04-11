import React, { createContext, useState, useContext, useEffect, useRef } from 'react'
import mqtt, {
  IClientOptions,
  IClientPublishOptions,
  IClientSubscribeOptions,
  MqttClient,
  Packet,
  PacketCallback
} from '@taoqf/react-native-mqtt'

import { Buffer } from 'buffer'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useWagner, WagnerConfigs } from './wagner'
global.Buffer = Buffer

interface MqttContextData {
  publish(
    topic: string,
    message: string | Buffer,
    opts: IClientPublishOptions,
    // callback: (
    //   topic_: string,
    //   payload: Buffer,
    //   packet: Packet,
    //   error?: Error
    // ) => void
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
    config: MqttProps,
    callback: () => void
  ): void
  clientMqtt: MqttClient;
  payload: Buffer;
  status: boolean;
  reconNumber: number;
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
  const { configs } = useWagner();
  const [clientMqtt, setClientMqtt] = useState<MqttClient>(() =>
    mqtt.connect(mqttProps.brokerUrl, mqttProps.options)
  )
  const [payload, setPayload] = useState<Buffer>()
  const [status, setStatus] = useState<boolean>(false)
  const [reconNumber, setReconNumber] = useState<number>(0)
  const reconTries = useRef(0);

  useEffect(() => {
    clientMqtt.on('connect', (packet: Packet) => {
      console.log('CONNECTED')
      setStatus(true)
    })

    clientMqtt.on('reconnect', (a: any, b: any) => {
      if (reconTries.current >= 5) {
        reconTries.current = 0;
        setReconNumber(0)
        clientMqtt.end(true);
        setStatus(false);
        return
      }
      setStatus(false)
      setReconNumber(reconTries.current + 1);
      reconTries.current = reconTries.current + 1;
      console.log('Reconnecting', a, b);
    })

    clientMqtt.on('error', (err) => {
      setStatus(false)
      console.error('Connection error: ', err)
      clientMqtt.end()
    })

    clientMqtt.on('end', () => {
      setStatus(false)
      console.log('Connection Ended')
      clientMqtt.end()
    })

    clientMqtt.on('disconnect', (packet: Packet) => {
      setStatus(false)
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
    // callback: (
    //   topic_: string,
    //   payload: Buffer,
    //   packet: Packet,
    //   error?: Error
    // ) => void
  ) => {
    clientMqtt.publish(topic, message, opts, (error, packet) => {
      if (error)
        Alert.alert('Erro', 'Ocorreu um erro inesperado durante a publicação. Tente novamente.')
      // clientMqtt.on(
      //   'message',
      //   (topic_: string, payload: Buffer, packet_: Packet) => {
      //     callback(topic_, payload, packet_, error)
      //   }
      // )
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

  const configureBroker = async (config: MqttProps, callback: () => void): Promise<void> => {
    clientMqtt.end(true)
    setClientMqtt(() => mqtt.connect(config.brokerUrl, config.options))
    const newConfigs: WagnerConfigs = { ...configs, mqttProps: config }
    await AsyncStorage.setItem('@Wagner:configs', JSON.stringify(newConfigs))
    callback();
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
        status,
        reconNumber
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