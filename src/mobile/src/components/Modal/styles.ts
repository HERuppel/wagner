import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../global/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    justifyContent: 'center'
  },
  content: {
    height: Dimensions.get('window').height / 3,
    backgroundColor: colors.prussianBlue,
    margin: 20,
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: 20
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonsText: {
    fontSize: 18,
    color: colors.aliceBlue,
  }
})