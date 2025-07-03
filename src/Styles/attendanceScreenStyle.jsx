import { Dimensions, StyleSheet } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SW, SH, SF } from '../utils/Dimensions';
import Colors from '../utils/Colors';
const { width: screenWidth, height: windowHeight } = Dimensions.get('window');
const daySize = screenWidth / 8.5;

const styles = StyleSheet.create({

    topFlexView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SW(10),
        paddingVertical: SH(10),
    },
    topBtnsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '1%',
        paddingHorizontal: '5%',
    },
    topBtn: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        width: '47%',
        height: windowHeight * 0.21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    imgStyle: {
        width: SW(65),
        height: SH(35),
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    statusView: {
        paddingVertical: SH(10),
    },
    chartstatusView: {
        paddingVertical: SH(5),
        paddingHorizontal: SW(10),
        backgroundColor: Colors.background,
        borderRadius: 12,
        alignItems: 'center',
        width: '30%',
    },
    showView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: SH(5),
    },
    showText: {
        color: 'gray',
        fontFamily: 'Inter-Regular',
        fontSize: SF(11),
    },
    arrowdown: {
        width: SW(25),
        height: SH(35),
        tintColor: 'gray',
    },
    timeChartView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // gap: SW(10),
    },

    chartstatusView: {
        backgroundColor: Colors.lightBlue,
        paddingHorizontal: SW(10),
        paddingVertical: SH(8),
        // borderRadius: 10,
        alignItems: 'center',
        minWidth: SW(85),
        //   elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },

    punchText: {
        textAlign: 'center',
        fontSize: SF(11),
        color: Colors.darkBlue,
        fontFamily: 'Inter-Bold',
    },

    totalHoursText: {
        fontSize: SF(11),
        fontFamily: 'Inter-Bold',
        color: Colors.darkBlue,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: SF(11),
        fontFamily: 'Inter-Medium',
        color: Colors.darkBlue,
        paddingHorizontal: SW(4),
    },
    filtr: {
        width: SW(30),
        height: SH(30),
        alignSelf: 'flex-end',
        right: SW(20),
    },
});

export default styles; 