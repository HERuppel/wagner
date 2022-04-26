import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, Text, StyleSheet, Alert, Image } from 'react-native'
import { IClientOptions } from '@taoqf/react-native-mqtt';
import { MqttProps, MqttProvider } from '../hooks/mqtt';
import { colors } from '../global/colors';
import AppRoutes from './app.routes';
import { WagnerConfigs, WagnerProvider } from '../hooks/wagner';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mqttProps: { brokerUrl: string, options: IClientOptions } = {
  brokerUrl: 'ws://broker.mqtt-dashboard.com:8000/mqtt',
  options: {
    port: 8000,
    protocol: 'ws' as 'ws',
    host: 'broker.mqtt-dashboard.com',
    clientId: `Wagner-${Math.floor(Math.random() * 100)}`,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false
    },
  },
};

const Routes = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true)
  const [retrievedMqttProps, setRetrievedMqttProps] = useState<MqttProps>({} as MqttProps);

  useEffect(() => {
    (async () => {
      try {
        const storedConfigs = await AsyncStorage.getItem('@Wagner:configs')
  
        if (storedConfigs) {
          const configs: WagnerConfigs = JSON.parse(storedConfigs);
  
          if (configs.mqttProps) {
            setRetrievedMqttProps(configs.mqttProps)
            setTimeout(() => {
              setLoading(false)
            }, 1500)
          } else {
            setRetrievedMqttProps(mqttProps)
            setTimeout(() => {
              setLoading(false)
            }, 1500)
          }
        }  else {
          await AsyncStorage.setItem('@Wagner:configs', JSON.stringify({ mqttProps }))
          setRetrievedMqttProps(mqttProps)
          setTimeout(() => {
            setLoading(false)
          }, 1500)
        }
      } catch (e) {
        Alert.alert('Ops...', 'Ocorreu um erro durante o carregamento: ' + `${e}`)
      }
    })()
  }, [])

  if (loading || !retrievedMqttProps) {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/DJWagner2.png')} style={{ height: 150, width: 180 }} />
        <Text style={styles.subtitle}>O próprio original</Text>
        <ActivityIndicator style={styles.loading} size='large' color={colors.carolinaBlue} />
      </View>
    )
  }

  return (
    <MqttProvider mqttProps={retrievedMqttProps}>
      <WagnerProvider>
        <AppRoutes />
      </WagnerProvider>
    </MqttProvider>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: colors.prussianBlue
  },
  title: {
    fontSize: 64,
    color: colors.cgBlue
  },
  subtitle: {
    fontSize: 22,
    color: colors.sapphireBlue,
  },
  loading: {
    paddingTop: 20
  } 
})

export default Routes;