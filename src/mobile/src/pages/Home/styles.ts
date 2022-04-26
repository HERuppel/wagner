import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../global/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.prussianBlue,
    position: 'relative'
  },
  header: {
    height: Dimensions.get('window').height / 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 0.3,
    borderBottomColor: '#000'
  },
  content: {
    height: Dimensions.get('window').height / 1.5,
    minHeight: Dimensions.get('window').height / 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30
  },
  slider: {
    width: Dimensions.get('window').width - 80,
    marginTop: 10
  },
  bottom: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    left: Dimensions.get('window').width / 2.9
  }
})