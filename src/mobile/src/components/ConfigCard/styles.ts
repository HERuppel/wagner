import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../global/colors';


export const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 40,
    height: 140,
    borderRadius: 10,
    margin: 20,
    padding: 20,
    borderColor: colors.cgBlue,
    borderWidth: 0.5,
    backgroundColor: colors.sapphireBlue,
    position: 'relative'
  },
  propsText: {
    fontSize: 18,
    color: colors.aliceBlue
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 40,
    zIndex: 9
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0
  },
  modalTitle: {
    fontSize: 18,
    color: colors.aliceBlue,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.prussianBlue,
    fontSize: 14,
    color: colors.aliceBlue
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0
  },
  buttonsText: {
    fontSize: 18,
    color: colors.aliceBlue,
  },
  label: {
    fontSize: 13,
    color: colors.aliceBlue,
    opacity: 0.7
  }
})