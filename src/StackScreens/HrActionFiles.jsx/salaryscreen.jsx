import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { containerStyle } from "../../Styles/ScreenContainer";
import AppHeader from "../../Components/AppHeader";
import styles from "../../Styles/SalaryHistoryStyle";
import Feather from "react-native-vector-icons/Feather";
import Colors from "../../utils/Colors";
import { SF, SH, SW } from "../../utils/Dimensions";
import FilterModal from "../../Components/FilterModal";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DummyPieChart from "../../Components/DummyPieChart ";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalaryHistory } from "../../redux/slices/salarySlice";
import { generatePDF } from "react-native-html-to-pdf";
import { showMessage } from "react-native-flash-message";
import RNFS from "react-native-fs";

const SalaryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { salaryHistory, loading } = useSelector((state) => state.salary);
  console.log("salaryHistory", salaryHistory);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    dateRange: { from: null, to: null },
  });

  useEffect(() => {
    const today = new Date();
    dispatch(fetchSalaryHistory({ month: today.getMonth() + 1, year: today.getFullYear() }));
  }, [dispatch]);

  const onApplyFilters = (appliedFilters) => {
    const fromDate = appliedFilters.dateRange.from
      ? new Date(appliedFilters.dateRange.from.setHours(0, 0, 0, 0))
      : null;

    const toDate = appliedFilters.dateRange.to
      ? new Date(appliedFilters.dateRange.to.setHours(23, 59, 59, 999))
      : null;

    setLocalFilters({
      dateRange: { from: fromDate, to: toDate },
    });

    if (fromDate) {
      dispatch(fetchSalaryHistory({
        month: fromDate.getMonth() + 1,
        year: fromDate.getFullYear()
      }));
    }
  };


  const moveToPublicDownloads = async (filePath) => {
    try {
      const destPath = `${RNFS.DownloadDirectoryPath}/salary-slip-${Date.now()}.pdf`;
      await RNFS.copyFile(filePath, destPath);
      console.log("PDF copied to:", destPath);
      return destPath;
    } catch (e) {
      console.log("Copy error:", e);
      return filePath;
    }
  };

  const generateSalarySlipHTML = (salaryItem) => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #003366; }
            h2 { text-align: center; }
            .section { background: #f2f2f2; padding: 10px; margin-bottom: 10px; border-radius: 6px; }
            .row { display: flex; justify-content: space-between; margin: 5px 0; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Salary Slip</h2>

          <div class="section">
            <div class="row bold">
              <span>${salaryItem?.company?.companyInfo?.profile?.brandName || salaryItem?.company?.name || "Company"}</span>
              <span>${new Date(salaryItem?.periodStart).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
            </div>
          </div>

          <div class="section">
            <div class="row"><span>Name:</span><span>${salaryItem?.user?.firstName} ${salaryItem?.user?.lastName}</span></div>
            <div class="row"><span>Employee ID:</span><span>${salaryItem?.user?.empId || "-"}</span></div>
            <div class="row"><span>Base Salary:</span><span>₹${Math.round(salaryItem?.user?.salary || 0).toLocaleString()}</span></div>
          </div>

          <div class="section">
            <h3>Earnings</h3>
            ${(salaryItem?.splits || [])
        .map(e => `<div class="row"><span>${e.name}</span><span>₹${Math.round(e.amount || 0).toLocaleString()}</span></div>`)
        .join("")}
            <div class="row bold"><span>Gross Salary</span><span>₹${Math.round(salaryItem?.grossSalary || 0).toLocaleString()}</span></div>
            <div class="row bold"><span>Annual Salary</span><span>₹${Math.round(salaryItem?.annualSalary || 0).toLocaleString()}</span></div>
          </div>

          <div class="section">
            <h3>Deductions</h3>
            ${(salaryItem?.deductions || [])
        .map(d => `<div class="row"><span>${d.name}</span><span>₹${Math.round(d.amount || 0).toLocaleString()}</span></div>`)
        .join("")}
          </div>

          <div class="section bold">
            <div class="row"><span>Net Salary (Take Home)</span><span>₹${Math.round(salaryItem?.netSalary || 0).toLocaleString()}</span></div>
          </div>
        </body>
      </html>
    `;
  };

  const createPDF = async (salaryItem) => {
    try {
      let options = {
        html: generateSalarySlipHTML(salaryItem),
        fileName: `salary-slip-${Date.now()}`,
        directory: "Download",
      };

      let results = await generatePDF(options);
      console.log("PDF generated at:", results.filePath);

      const finalPath = await moveToPublicDownloads(results.filePath);

      showMessage({ message: "PDF saved in Downloads", type: "success" });

    } catch (err) {
      console.error("Error creating/opening PDF:", err);
      showMessage({
        message: "Please install a PDF viewer app (like Google PDF Viewer or Adobe Acrobat)",
        type: "warning",
      });
    }
  };




  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: index % 2 === 0 ? "#fff" : "#f8faff" },
      ]}
    >
      <Text style={styles.cardTitle}>
        {new Date(item.periodStart).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Text>

      <View style={styles.cardDetailsRow}>
        <View style={styles.cardDetailBox}>
          <Text style={styles.label}>Gross Salary</Text>
          <Text style={styles.value}>₹{item.grossSalary}</Text>
        </View>
        <View style={styles.cardDetailBox}>
          <Text style={styles.label}>Net Salary</Text>
          <Text style={styles.value}>₹{item.netSalary}</Text>
        </View>
        <View style={styles.cardDetailBox}>
          <Text style={styles.label}>Annual</Text>
          <Text style={styles.value}>₹{item.annualSalary}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.ViewReceiptButton}
          onPress={() => navigation.navigate("ViewReceiptScreen", { salaryItem: item })}
        >
          <Feather name="file-text" size={16} color={Colors.darkOrange} style={{ marginRight: SW(6) }} />
          <Text style={styles.ViewReceiptText}>View Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadButtonAlt}
          onPress={() => createPDF(item)} // 👈 Dynamic + Open
          activeOpacity={0.7}
        >
          <Feather name="download" size={16} color={Colors.darkBlue} style={{ marginRight: SW(6) }} />
          <Text style={styles.downloadTextAlt}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={containerStyle.container} edges={["top", "bottom"]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <AppHeader navigation={navigation} title="Salary History" />
        <View style={{ alignSelf: "flex-end", flexDirection: "row", alignItems: "center", marginBottom: SH(10) }}>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ marginLeft: 10, paddingHorizontal: 5 }}>
            <MaterialIcons name="filter-list" size={26} color={Colors.gradientBlue} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading && <ActivityIndicator size="large" color={Colors.darkBlue} style={{ marginTop: SH(20) }} />}

        {!loading && salaryHistory.length > 0 && (
          <>
            <DummyPieChart salaryData={salaryHistory} />
            <FlatList
              data={salaryHistory}
              keyExtractor={(item, index) => item._id + index}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </>
        )}

        {!loading && salaryHistory.length === 0 && (
          <View style={{ alignItems: "center", marginTop: SH(50) }}>
            <Text style={{ fontSize: SF(16), color: Colors.darkGray }}>
              No Salary records found for this user.
            </Text>
          </View>
        )}

        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          options={[]}
          selectedFilters={localFilters}
          onApply={onApplyFilters}
          showDateFilter={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SalaryScreen;
