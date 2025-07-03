import { StyleSheet } from 'react-native';
import { SH, SW, SF } from '../utils/Dimensions';
import Colors from '../utils/Colors';

const styles = StyleSheet.create({
  cardContainer: {
  borderRadius: 12,
  paddingHorizontal: SH(14),
  paddingVertical:SH(14),
  marginHorizontal:0,
  marginBottom: SH(5),
  backgroundColor: '#fff',
  shadowColor:Colors.gradientBlue,
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 3,
  borderWidth: 0.4,
  borderColor: '#ccc',
},

cardTitle: {
  fontSize: SF(12),
  fontFamily: 'Inter-Bold',
  color: Colors.darkBlue,
  marginBottom: SH(10),
},

cardDetailsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
},

cardDetailBox: {
  width: '48%',
  marginBottom: SH(10),
  backgroundColor: '#f2f6fc',
  paddingHorizontal: SH(8),
  paddingVertical:SH(8),
  borderRadius: 8,
},

label: {
  fontSize: SF(10),
  fontFamily: 'Inter-Medium',
  color: Colors.darkBlue,
},

value: {
  fontSize: SF(11),
  fontFamily: 'Inter-Bold',
  color: Colors.darkBlue,
},

buttonRow: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: SW(10),
},
ViewReceiptButton:{
 backgroundColor:Colors.orange,
 paddingHorizontal:SW(5),
 paddingVertical:SH(3),
 borderRadius:5,
  display:"flex",
 flexDirection:"row"
},
ViewReceiptText:{
 color:Colors.darkOrange,
 fontSize:SF(11),
 fontFamily:"Inter-Medium"
},
downloadButtonAlt:{
 backgroundColor:Colors.lightBlue,
 paddingHorizontal:SW(5),
 paddingVertical:SH(3),
 borderRadius:5,
 display:"flex",
 flexDirection:"row"
},
downloadTextAlt:{
 color:Colors.darkBlue,
  fontSize:SF(11),
 fontFamily:"Inter-Medium"
}
 
});

export default styles;
