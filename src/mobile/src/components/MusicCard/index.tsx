import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { Song } from '../../utils/playlist';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { colors } from '../../global/colors';

const MusicCard = ({ name, author, length }: Song): JSX.Element => {
  const [playing, setPlaying] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(0)
  let interval: NodeJS.Timer;

  useEffect(() => {
    if (playing) {
      interval = setInterval(() => {
        if (timer <= length) {
          setTimer(timer + 1)
        } else {
          setPlaying(false)
          setTimer(0)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }

  }, [playing, timer])

  const playMusic = (): void => {
    if (playing) {
      setPlaying(false)
      setTimer(0)
      return
    }
    setPlaying(true)
  }


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/DJWagner.jpg')} style={{ height: 60, width: 60, resizeMode: 'contain' }} />
        <View style={{ marginLeft: -50 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.author}>{author}</Text>
        </View>
        <TouchableOpacity
          onPress={playMusic}
          activeOpacity={.6}
        >
          {
            !playing 
              ? <MaterialIcons name='play-circle-filled' size={45} color={colors.aliceBlue} />
              : <MaterialIcons name='pause-circle-filled' size={45} color={colors.aliceBlue} />
            }
        </TouchableOpacity>
      </View>
      <View 
        style={{ 
          ...styles.progressBar,
          width: timer * Dimensions.get('window').width / length,
        }} />
    </View>
  )
}

export default MusicCard