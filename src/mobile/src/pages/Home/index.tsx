import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { View, TouchableOpacity } from 'react-native';
import Slider, { SliderRef } from '@react-native-community/slider';
import { StackAppParams } from '../../routes/app.routes';
import { styles } from './styles';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../global/colors';
import MqttStatus from '../../components/MqttStatus';
import Joypad from '../../components/Joypad';
import { useMqtt } from '../../hooks/mqtt';
import { useWagner } from '../../hooks/wagner';

const Home = (): JSX.Element => {
  const navigation = useNavigation<NavigationProp<StackAppParams>>()
  const { configs: { controlTopic, speedTopic } } = useWagner()
  const { publish, subscribe, status, payload } = useMqtt()
  const [currentSliderValue, setCurrentSliderValue] = useState<number>(0)

  useEffect(() => {
    if (status) {
      subscribe(speedTopic, { qos: 1, nl: true })
    } 
  }, [status])

  useEffect(() => {
    if (payload && Number(payload.toString()) !== currentSliderValue) {
      setCurrentSliderValue(Number(payload.toString()))
    }
  }, [payload])

  const executeButtonAction = (action: string): void => {
    publish(controlTopic, action, { qos: 1 })
  }

  const setSliderValue = (value: number): void => {
    setCurrentSliderValue(Number(Math.floor(value)));
    publish(speedTopic, `${Math.floor(value)}`, { qos: 1 })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={.6}
          onPress={() => navigation.navigate('Jukebox', {})}
        >
          <MaterialIcons name='music-note' size={35} color={colors.aliceBlue} />
        </TouchableOpacity>
        <MqttStatus />
        <TouchableOpacity
          activeOpacity={.6}
          onPress={() => navigation.navigate('Config', {})}
        >
          <MaterialIcons name='settings' size={35} color={colors.aliceBlue} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Joypad executeAction={executeButtonAction} />
        <View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={colors.cgBlue}
            maximumTrackTintColor="#000000"
            thumbTintColor={colors.carolinaBlue}
            onSlidingComplete={setSliderValue}
            value={currentSliderValue}
          />
        </View>
      </View>
    </View>
  )
}

export default Home;