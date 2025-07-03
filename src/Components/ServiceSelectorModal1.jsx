import { Modal, View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { styles } from "../Styles/AddExpense";
import Colors from "../utils/Colors";

export const ServiceSelectorModal1 = ({ visible, onClose, onSelect, serviceList }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.handleBar} />

            <ScrollView>
              {serviceList.map((item, index) => (
                <TouchableOpacity
                  key={index}
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
