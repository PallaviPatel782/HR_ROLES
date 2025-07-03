import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SH, SW, SF } from '../utils/Dimensions';
import Colors from '../utils/Colors';

const Heading = ({ title, showViewAll = false, onViewAllPress, titleColor = Colors.black ,style  }) => {
    return (
        <View style={[styles.headingContainer, style]}>
            <Text style={[styles.headingText, { color: titleColor }]}>{title}</Text>
            {showViewAll && onViewAllPress && (
                <TouchableOpacity onPress={onViewAllPress}>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Heading;

const styles = StyleSheet.create({
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SW(20),
        paddingVertical: SH(15),
    },
    headingText: {
        fontFamily: "Inter-Medium",
        fontSize: SF(18),
        color: Colors.black,
    },
    viewAllText: {
        fontFamily: "Inter-Medium",
        fontSize: SF(14),
        color: Colors.gradientBlue
    },
});
