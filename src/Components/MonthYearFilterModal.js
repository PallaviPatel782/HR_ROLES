import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Colors from "../utils/Colors";
import { SH, SW, SF } from "../utils/Dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";
import GradientButton from "../Components/GradientButton";
import { Dropdown } from "react-native-element-dropdown";

const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => {
  const y = currentYear - 50 + i;
  return { label: `${y}`, value: `${y}` };
});

const MonthYearFilterModal = ({ visible, onClose, selected, onApply }) => {
  const [local, setLocal] = useState({
    month: selected.month ? `${selected.month}` : null,
    year: selected.year ? `${selected.year}` : null,
  });

  useEffect(() => {
    setLocal({
      month: selected.month ? `${selected.month}` : null,
      year: selected.year ? `${selected.year}` : null,
    });
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={{ flex: 1 }} />

        <View
          style={{
            backgroundColor: Colors.light,
            paddingHorizontal: SW(20),
            paddingVertical: SH(20),
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "70%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: SH(10),
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <Ionicons name="filter" size={20} color={Colors.darkBlue} /> */}
              <Text
                style={{
                  fontSize: SF(15),
                  fontFamily: "Inter-Medium",
                  color:"#000",
                  marginLeft: SW(8),
                }}
              >
                Select Month & Year
              </Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={"#000"} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: SF(16),
              marginBottom: SH(8),
              color: Colors.darkBlue,
              fontFamily: "Inter-Medium",
            }}
          >
            Month
          </Text>

          <Dropdown
            data={months}
            labelField="label"
            valueField="value"
            placeholder="Select Month"
            value={local.month}
            onChange={(item) =>
              setLocal((prev) => ({ ...prev, month: `${item.value}` }))
            }
            style={{
              height: SH(50),
              backgroundColor: Colors.background,
              borderRadius: 10,
              paddingHorizontal: SW(10),
            }}
            placeholderStyle={{ color: Colors.darkBlue }}
            selectedTextStyle={{ color: Colors.darkBlue }}
            itemTextStyle={{ color: Colors.dark }}
            activeColor={Colors.background} 
            containerStyle={{
              backgroundColor: "white",
              borderRadius: 10,
            }}
          />
          <Text
            style={{
              fontSize: SF(16),
              marginBottom: SH(8),
              marginTop: SH(12),
              color: Colors.darkBlue,
              fontFamily: "Inter-Medium",
            }}
          >
            Year
          </Text>

          <Dropdown
            data={years}
            labelField="label"
            valueField="value"
            placeholder="Select Year"
            search
            value={local.year}
            maxHeight={240}
            onChange={(item) =>
              setLocal((prev) => ({ ...prev, year: `${item.value}` }))
            }
            style={{
              height: SH(50),
              backgroundColor: Colors.background,
              borderRadius: 10,
              paddingHorizontal: SW(10),
              marginBottom: SH(10),
            }}
            placeholderStyle={{ color: Colors.darkBlue }}
            selectedTextStyle={{ color: Colors.darkBlue }}
            itemTextStyle={{ color: Colors.dark }}
            inputSearchStyle={{ color: Colors.dark }}
            containerStyle={{
              backgroundColor: "white",
              borderRadius: 10,
            }}
          />

          <GradientButton
            title="Apply"
            onPress={() => {
              onApply({
                month: Number(local.month),
                year: Number(local.year),
              });
              onClose();
            }}
            style={{ marginTop: SH(15) }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default MonthYearFilterModal;
