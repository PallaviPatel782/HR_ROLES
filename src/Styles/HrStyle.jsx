import { StyleSheet } from 'react-native';
import { SF, SH, SW } from '../utils/Dimensions';
import Colors from '../utils/Colors';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SW(15),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SH(20),
        marginBottom: SH(10),
    },
    sectionTitle: {
        fontSize: SF(16),
        fontFamily: "Inter-Medium",
        color: Colors.darkBlue,
    },
    sectionAction: {
        fontSize: SF(15),
        color: Colors.primary,
        fontWeight: '600',
    },
    punchCard: {
        backgroundColor: '#2D32EC',
        borderRadius: 20,
        paddingVertical: SH(12),
        paddingHorizontal: SW(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    punchTimes: {
        flex: 1,
    },
    punchLabel: {
        color: Colors.light,
        fontSize: SF(15),
        opacity: 0.8,
    },
    punchTime: {
        color: Colors.light,
        fontSize: SF(16),
        fontFamily: "Inter-Medium"
    },
    punchOutButton: {
        backgroundColor: '#1B1FE0',
        borderRadius: 14,
        paddingVertical: SH(12),
        paddingHorizontal: SW(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    punchOutText: {
        color: 'white',
        fontSize: SF(13),
        fontFamily: "Inter-Medium",
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '49%',
        aspectRatio: 1,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SH(10),
        // elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    cardText: {
        marginTop: SH(10),
        fontSize: SF(13),
        fontFamily: "Inter-Medium",
        color: 'white',
        textAlign: 'center',
    },
    iconWrapper: {
        width: SW(50),
        height: SH(50),
        borderRadius: 25,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SH(8),
    },
      NameContainer: {
        backgroundColor: Colors.gradientBlue,
        paddingHorizontal: SW(18),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    noon: {
        fontSize: SF(18),
        color: Colors.light,
        fontFamily: "Inter-Bold"
    },
    name: {
        fontSize: SF(15),
        color: Colors.light,
        fontFamily: "Inter-Regular"
    },
    icon: {
        fontSize: SF(25),
        marginRight: SW(10)
    }
});

export default styles;
