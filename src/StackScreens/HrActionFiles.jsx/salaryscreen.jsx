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
import { fetchSalaryHistory, fetchSalaryMeta } from "../../redux/slices/salarySlice";
import { generatePDF } from "react-native-html-to-pdf";
import { showMessage } from "react-native-flash-message";
import RNFS from "react-native-fs";
import { BASE_URL, IMG_URL } from "../../utils/BASE_URL";
import FileViewer from "react-native-file-viewer";
import MonthYearFilterModal from "../../Components/MonthYearFilterModal";

const SalaryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const { salaryHistory, loading } = useSelector((state) => state.salary);
  const [monthYearVisible, setMonthYearVisible] = useState(false);

  const { departmentsList, designationsList } = useSelector(state => state.salary);
  const departmentTitle =
    departmentsList?.[0]?.department?.title || "-";
  const designationName =
    designationsList?.[0]?.name || "-";
  const [localFilters, setLocalFilters] = useState({
    month: null,
    year: null,
  });


  useEffect(() => {
    console.log("salaryHistory", salaryHistory);
    console.log("localFilters:", localFilters);
    console.log("isFilterApplied:", isFilterApplied);

    dispatch(fetchSalaryMeta());
    dispatch(fetchSalaryHistory());
  }, []);


  const filteredSalaryHistory = salaryHistory.filter(item => {
    if (!localFilters.month || !localFilters.year) return true;

    const date = new Date(item.periodStart);

    return (
      date.getMonth() + 1 === Number(localFilters.month) &&
      date.getFullYear() === Number(localFilters.year)
    );
  });

  const onApplyFilters = async (filter) => {
    setLocalFilters(filter); // store selected month/year
    setIsFilterApplied(true);

    if (filter.month && filter.year) {
      // Dispatch API call with filters
      dispatch(fetchSalaryHistory({ month: filter.month, year: filter.year }));
    } else {
      // No filter → fetch all
      dispatch(fetchSalaryHistory());
    }

    setMonthYearVisible(false);
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

  const convertUrlToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.log("Logo convert error:", err);
      return "";
    }
  };

  const generateSalarySlipHTML = (
    salaryItem,
    departmentTitle,
    designationName,
    logoBase64
  ) => {
    const companyName =
      salaryItem?.company?.companyInfo?.profile?.brandName ||
      salaryItem?.company?.companyName ||
      "Company";

    const monthName = new Date(salaryItem?.periodStart).toLocaleDateString(
      "en-GB",
      { month: "long", year: "numeric" }
    );

    return `
  <html>
    <head>
      <style>
  body {
    font-family: Arial, sans-serif;
    padding: 16px;
    color: #003366;
    background: #ffffff;
    font-size: 12px;
  }

  .header-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
  }

  .company-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    margin-bottom: 12px;
  }

  /* FIXED — SAME WIDTH FOR EVERY TABLE */
  table {
    width: 100%;
    border: 1px solid #d0d7de;
    border-collapse: collapse;
    margin-bottom: 16px;
    table-layout: fixed;         
  }

  th, td {
  border: 1px solid #d0d7de;
  padding: 6px 8px;
  width: 50%;
  text-align: left;
  word-wrap: break-word;
  font-size: 9px;      
  font-weight: normal; 
}

th {
  background: #eef4fa;
  font-weight: normal;  
}
  .section-title {
    font-size: 12px;
    font-weight: bold;
    margin: 6px 0;
  }

  .footer {
    text-align: center;
    margin-top: 10px;
    font-size: 10px;
    color: #666;
  }
</style>

    </head>

    <body>

      <!-- HEADER -->
      <div class="header-title">
        <span>Salary Slip</span>
        <span>${monthName}</span>
      </div>

      <div class="company-row">
        <span>${companyName}</span>
        ${logoBase64
        ? `<img src="${logoBase64}" style="width:40px;height:40px;object-fit:contain;" />`
        : ""
      }
      </div>


      <!-- EMPLOYEE DETAILS (UNIFORM TABLE) -->
      <div class="section-title">Employee Details</div>
      <table>
        <tr><th>Name</th><td>${salaryItem?.user?.firstName} ${salaryItem?.user?.lastName}</td></tr>
        <tr><th>Employee ID</th><td>${salaryItem?.user?.empId || "-"}</td></tr>
        <tr><th>Department</th><td>${departmentTitle}</td></tr>
        <tr><th>Designation</th><td>${designationName}</td></tr>
        <tr><th>Base Salary (CTC)</th><td>₹${salaryItem?.user?.salary?.toLocaleString()}</td></tr>
        <tr><th>Present Days</th><td>${salaryItem?.presentDays}</td></tr>
        <tr><th>Absent Days</th><td>${salaryItem?.absentDays}</td></tr>
        <tr><th>Working Days</th><td>${salaryItem?.totalWorkDays}</td></tr>
      </table>


      <!-- BANK DETAILS (UNIFORM TABLE) -->
      <div class="section-title">Bank Details</div>

      <table>
        <tr><th>Account Holder</th><td>${salaryItem?.user?.acHolderName || "-"}</td></tr>
        <tr><th>Bank Name</th><td>${salaryItem?.user?.bankName || "-"}</td></tr>
        <tr><th>Branch Name</th><td>${departmentTitle}</td></tr>
        <tr><th>Account Number</th><td>${designationName}</td></tr>
        <tr><th>IFSC Code</th><td>₹${salaryItem?.user?.salary?.toLocaleString()}</td></tr>
      </table>

      <div class="section-title">Attendance Summary</div>
<table>
  <tr><th>Present Days</th><td>${salaryItem?.presentDays}</td></tr>
  <tr><th>Absent Days</th><td>${salaryItem?.absentDays}</td></tr>
  <tr><th>Working Days</th><td>${salaryItem?.totalWorkDays}</td></tr>
</table>

      <!-- EARNINGS -->
      <div class="section-title">Earnings</div>
      <table>
        <tr><th>Name</th><th>Amount</th></tr>

        ${salaryItem?.splits
        ?.map(
          (e) =>
            `<tr><td>${e.name}</td><td>₹${e.amount.toLocaleString()}</td></tr>`
        )
        .join("")}

        <tr><th>Gross Salary</th><td>₹${salaryItem?.grossSalary?.toLocaleString()}</td></tr>
        <tr><th>Annual Salary</th><td>₹${salaryItem?.annualSalary?.toLocaleString()}</td></tr>
      </table>


      <!-- DEDUCTIONS -->
      <div class="section-title">Deductions</div>
      <table>
        <tr><th>Name</th><th>Amount</th></tr>

        ${salaryItem?.deductions
        ?.map(
          (d) =>
            `<tr><td>${d.name}</td><td>₹${d.amount.toLocaleString()}</td></tr>`
        )
        .join("")}

        ${salaryItem?.extraDeductions
        ?.map(
          (d) =>
            `<tr><td>${d.name}</td><td>₹${d.amount.toLocaleString()}</td></tr>`
        )
        .join("")}
      </table>


      <!-- NET SALARY -->
      <div class="section-title">Net Salary</div>
      <table>
        <tr><th>Net Salary (Take Home)</th><td><b>₹${salaryItem?.netSalary?.toLocaleString()}</b></td></tr>
      </table>


      <!-- FOOTER -->
      <div class="footer">
        Generated automatically on ${new Date().toLocaleDateString()}
      </div>

    </body>
  </html>
  `;
  };



  const createPDF = async (salaryItem) => {
    try {
      const fullLogoPath = `${IMG_URL}/${salaryItem.company.image}`;
      const logoBase64 = await convertUrlToBase64(fullLogoPath);

      let options = {
        html: generateSalarySlipHTML(
          salaryItem,
          departmentTitle,
          designationName,
          logoBase64
        ),
        fileName: `salary-slip-${Date.now()}`,
        directory: "Download",
      };

      const results = await generatePDF(options);
      console.log("PDF generated at:", results.filePath);
      const finalPath = await moveToPublicDownloads(results.filePath);
      console.log("Copied to:", finalPath);
      FileViewer.open(finalPath, {
        showOpenWithDialog: true,
        showAppsSuggestions: true,
      })
        .then(() => console.log("PDF opened from Downloads"))
        .catch((err) => console.log("Viewer error:", err));

      showMessage({
        message: "PDF saved in Downloads",
        type: "success",
      });

    } catch (err) {
      console.error("PDF Error:", err);
      showMessage({
        message: "Failed to generate PDF",
        type: "danger",
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
          onPress={() => navigation.navigate("ViewReceiptScreen", {
            salaryItem: item,
          })}
        >
          <Feather name="file-text" size={16} color={Colors.darkOrange} style={{ marginRight: SW(6) }} />
          <Text style={styles.ViewReceiptText}>View Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadButtonAlt}
          onPress={() => createPDF(item)}
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
          <TouchableOpacity onPress={() => setMonthYearVisible(true)}>
            <MaterialIcons name="filter-list" size={26} color={Colors.gradientBlue} />
          </TouchableOpacity>

        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DummyPieChart salaryData={salaryHistory} />
        {loading && <ActivityIndicator size="large" color={Colors.darkBlue} style={{ marginTop: SH(20) }} />}

        {!loading && filteredSalaryHistory.length > 0 && (
          <>
            <FlatList
              data={filteredSalaryHistory}
              keyExtractor={(item, index) => item._id + index}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </>
        )}

        {!loading && isFilterApplied && filteredSalaryHistory.length === 0 && (
          <View style={{ alignItems: "center", marginTop: SH(50) }}>
            <Text style={{ fontSize: SF(16), color: Colors.darkGray }}>
              No payroll records found for the given criteria
            </Text>
          </View>
        )}
        {!loading && !isFilterApplied && salaryHistory.length === 0 && (
          <View style={{ alignItems: "center", marginTop: SH(50) }}>
            <Text style={{ fontSize: SF(16), color: Colors.darkGray }}>
              No Salary records found for this user.
            </Text>
          </View>
        )}

        <MonthYearFilterModal
          visible={monthYearVisible}
          onClose={() => setMonthYearVisible(false)}
          selected={{
            month: localFilters.month,
            year: localFilters.year
          }}
          onApply={onApplyFilters}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default SalaryScreen;
