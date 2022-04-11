import { StyleSheet } from 'react-native';
import { colors } from '../../global/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.prussianBlue
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 0.3,
    borderBottomColor: '#000',
    minHeight: 40
  },
  title: {
    fontSize: 24,
    color: colors.aliceBlue
  },
  content: {
    flex: 18,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  switchContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'flex-start'
  },
  switchText: {
    fontSize: 18,
    color: colors.aliceBlue,
    paddingLeft: 10
  },
  switchSubText: {
    fontSize: 14,
    color: colors.carolinaBlue,
    paddingLeft: 10,
    opacity: 0.7,
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