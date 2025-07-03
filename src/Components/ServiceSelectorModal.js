import { useState } from "react";
import { Modal, View, Text, ScrollView, TouchableOpacity, TextInput,TouchableWithoutFeedback  } from "react-native";
import { styles } from "../Styles/AddExpense";
import Colors from "../utils/Colors";
import AntDesign from 'react-native-vector-icons/AntDesign';


export const ServiceSelectorModal = ({ visible, onClose, onSelect, serviceList }) => {
    const [searchText, setSearchText] = useState('');

    const filteredServices = serviceList
        .map(section => ({
            ...section,
            items: section.items.filter(item =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
            )
        }))
        .filter(section => section.items.length > 0);

    return (
        <Modal visible={visible} transparent animationType="slide">
           <TouchableWithoutFeedback onPress={onClose}>
             <View style={styles.bottomSheetOverlay}>
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.handleBar} />
                    <View style={{ position: 'relative', marginVertical: 10 }}>
                        <TextInput
                            placeholder="Search for Services"
                            placeholderTextColor={Colors.gray}
                            value={searchText}
                            onChangeText={setSearchText}
                            style={styles.searchBox}
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchText('')}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    top: 12,
                                    zIndex: 1,
                                }}
                            >
                                <AntDesign name="closecircle" size={18} color={Colors.gray} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView>
                        {filteredServices.map((section, sectionIndex) => (
                            <View key={sectionIndex}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={itemIndex}
                                        style={styles.serviceItem}
                                        onPress={() => {
                                            onSelect(item.name);
                                            onClose();
                                        }}
                                    >
                                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                                        <Text style={styles.serviceText}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                        <Text style={styles.modalCloseText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
           </TouchableWithoutFeedback>
        </Modal>
    );
};
