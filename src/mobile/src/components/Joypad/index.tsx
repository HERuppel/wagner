import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styles } from './styles';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../global/colors';

type Joypad = {
  executeAction: (action: string) => void;
}

const Joypad = ({ executeAction }: Joypad): JSX.Element => {

  return (
    <>
    <View style={styles.topButtons}>
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => executeAction('<19#210>')}
    >
      <MaterialIcons name='keyboard-arrow-up' style={{ transform: [{ rotateZ: '-45deg' }] }} size={150} color={colors.aliceBlue} />
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => executeAction('<19#204>')}
    >
      <MaterialIcons name='keyboard-arrow-up' size={150} color={colors.aliceBlue} />
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => executeAction('<19#212>')}
    >
      <MaterialIcons name='keyboard-arrow-up' style={{ transform: [{ rotateZ: '45deg' }] }} size={150} color={colors.aliceBlue} />
    </TouchableOpacity>
  </View>
  <View style={styles.middleButtons}>
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => executeAction('<20#206>')}
    >
      <MaterialIcons name='keyboard-arrow-left' size={150} color={colors.aliceBlue} />
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => executeAction('<20#202>')}
    >
      <MaterialIcons name='crop-square' size={110} style={{ paddingTop: 20 }} color={colors.aliceBlue} />
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => executeAction('<20#208>')}
    >
      <MaterialIcons name='keyboard-arrow-right' size={150} color={colors.aliceBlue} />
    </TouchableOpacity>
  </View>
  <View style={styles.bottomButtons}>
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => executeAction('<21#210>')}
    >
      <MaterialIcons name='keyboard-arrow-left' style={{ transform: [{ rotateZ: '-45deg' }] }} size={150} color={colors.aliceBlue} />
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => executeAction('<21#204>')}
    >
      <MaterialIcons name='keyboard-arrow-down' size={150} color={colors.aliceBlue} />
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => executeAction('<21#212>')}
    >
      <MaterialIcons name='keyboard-arrow-right' style={{ transform: [{ rotateZ: '45deg' }] }} size={150} color={colors.aliceBlue} />
    </TouchableOpacity>
  </View>
  </>
  )
}

export default Joypad;