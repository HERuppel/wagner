import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { styles } from './styles';

interface CustomModal {
  visible: boolean;
  onClose: () => void;
  height?: number
}

const CustomModal: React.FC<CustomModal> = ({ children, onClose, visible, height }) => {

  return (
    <Modal
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
      transparent
    >
      <View style={styles.container}>
        <View style={height ? { ...styles.content, height: height } : styles.content }>
          {children}
        </View>
      </View>
    </Modal>
  )
}

export default CustomModal;