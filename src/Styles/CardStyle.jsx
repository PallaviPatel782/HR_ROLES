import { StyleSheet, Platform } from 'react-native';
import { SW,SF,SH } from '../utils/Dimensions';
import Colors from '../utils/Colors';

export const cardstyle = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: SW(10),
    paddingVertical: SH(20),
    marginVertical: SH(10),
    marginHorizontal:SW(1),
    alignSelf: 'stretch',
    shadowColor: Colors.gradientBlue,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
});
