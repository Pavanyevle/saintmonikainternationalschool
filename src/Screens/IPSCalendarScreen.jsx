import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import RNFS from "react-native-fs";

const IPSCalendarScreen = ({ navigation }) => {
  const [calendarImg, setCalendarImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const fetchCalendar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://international-public-sch-db945-default-rtdb.firebaseio.com/calendar.json"
      );

      if (res.data?.imageUrl) {
        setCalendarImg(res.data.imageUrl);
      } else {
        setCalendarImg(null);
      }
    } catch (error) {
      console.log("Calendar fetch error:", error);
      Alert.alert("Error", "Failed to load calendar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const requestPermission = useCallback(async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }, []);

  const downloadImage = useCallback(async () => {
    if (!calendarImg) return;

    const permissionGranted = await requestPermission();
    if (!permissionGranted) {
      Alert.alert("Permission denied", "Storage permission required");
      return;
    }

    try {
      setDownloading(true);
      const fileName = `IPS_Calendar_${Date.now()}.jpg`;
      const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      await RNFS.downloadFile({
        fromUrl: calendarImg,
        toFile: path,
      }).promise;

      Alert.alert("Success 🎉", "Calendar downloaded successfully!");
    } catch (error) {
      console.log("Download error:", error);
      Alert.alert("Error", "Failed to download calendar");
    } finally {
      setDownloading(false);
    }
  }, [calendarImg, requestPermission]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#083f66" />

      <LinearGradient colors={["#083f66", "#083f66"]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={navigation.goBack}
            style={styles.backBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>📅 IPS Calendar</Text>
        </View>
      </LinearGradient>

      {/* Body */}
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color="#0f6aa5" />
        ) : calendarImg ? (
          <>
            <Image
              source={{ uri: calendarImg }}
              style={styles.calendarImg}
              resizeMode="contain"
            />

            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={downloadImage}
              disabled={downloading}
            >
              <MaterialCommunityIcons
                name="download"
                size={20}
                color="#fff"
              />
              <Text style={styles.downloadText}>
                {downloading ? "Downloading..." : "Download Calendar"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.noDataBox}>
            <MaterialCommunityIcons
              name="calendar-remove"
              size={60}
              color="#aaa"
            />
            <Text style={styles.noDataText}>No Calendar Available</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default IPSCalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f8",
  },
  header: {
    paddingBottom: 22,
    paddingHorizontal: 16,
    height: 120,
    paddingTop: Platform.OS === "android" ? 50 : 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "800",
  },
  body: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarImg: {
    width: "100%",
    height: 380,
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 4,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#0f6aa5",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
    elevation: 4,
  },
  downloadText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
  noDataBox: {
    alignItems: "center",
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
  },
});
