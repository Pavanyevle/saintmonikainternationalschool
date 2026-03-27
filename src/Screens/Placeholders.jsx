import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Placeholder = ({ title }) => (
  <View style={styles.wrap}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>Coming soon</Text>
  </View>
);

export const Events = (props) => <Placeholder title="Important Events" />;
export const StudyMaterial = (props) => <Placeholder title="Study Material" />;
export const LessonPlan = (props) => <Placeholder title="Lesson Plan" />;
export const ExamSyllabus = (props) => <Placeholder title="Exam Syllabus" />;
export const ExamReport = (props) => <Placeholder title="Exam Report" />;
export const PaymentHistory = (props) => <Placeholder title="Payment History" />;

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, color: '#213547', fontWeight: '700' },
  subtitle: { marginTop: 6, fontSize: 14, color: '#718096' },
});

export default Placeholder;


