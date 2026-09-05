import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, SafeAreaView, StatusBar, TextInput } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [points, setPoints] = useState(1250);
  const [userEmail, setUserEmail] = useState('');
  const [spinCooldown, setSpinCooldown] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const referralCode = "PAYPOP-8849";

  const addPoints = (amount, source) => {
    setPoints(prev => prev + amount);
    Alert.alert("تهانينا! 🎉", `حصلت على ${amount} نقطة من ${source}`);
  };

  const spinWheel = () => {
    if (spinCooldown) {
      Alert.alert("انتظر قليلاً!", "يمكنك تدوير العجلة مرة واحدة كل 24 ساعة.");
      return;
    }
    const reward = Math.floor(Math.random() * 90) + 10;
    addPoints(reward, "عجلة الحظ اليومية");
    setSpinCooldown(true);
  };

  const handleWithdraw = (method) => {
    if (points < 5000) {
      Alert.alert("الرصيد غير كافٍ", "الحد الأدنى للسحب هو 5000 نقطة ($5.00).");
      return;
    }
    if (!withdrawAddress) {
      Alert.alert("خطأ", "يرجى كتابة رقم الحساب أو العنوان الخاص بك للسحب.");
      return;
    }
    Alert.alert("تم إرسال الطلب ⏳", `سيتم تحويل المبلغ عبر ${method} إلى: ${withdrawAddress} خلال 24 ساعة.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6C5CE7" barStyle="light-content" />
      
      {currentScreen !== 'login' && (
        <View style={styles.header}>
          <Text style={styles.logo}>PayPop</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{points} نقطة (${(points/1000).toFixed(2)})</Text>
          </View>
        </View>
      )}

      {currentScreen === 'login' && (
        <View style={styles.authContainer}>
          <Text style={styles.appTitle}>PayPop 🎁</Text>
          <Text style={styles.subTitle}>سجل دخولك وابدأ جمع الأرباح</Text>
          <TextInput 
            style={styles.input} 
            placeholder="البريد الإلكتروني" 
            placeholderTextColor="#888"
            onChangeText={setUserEmail}
          />
          <TextInput 
            style={styles.input} 
            placeholder="كلمة السر" 
            secureTextEntry 
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={styles.btnText}>تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentScreen === 'home' && (
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>الرصيد الحالي</Text>
            <Text style={styles.pointsText}>{points} نقطة</Text>
            <Text style={styles.subPoints}>تساوي ${(points/1000).toFixed(2)} دولار أمريكي</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🌀 عجلة الحظ اليومية</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={spinWheel}>
              <Text style={styles.btnText}>{spinCooldown ? "عد غداً للتدوير" : "أدر العجلة الآن (+10 إلى +100)"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'earn' && (
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎬 مشاهدة إعلان (AdMob)</Text>
            <Text style={styles.cardDesc}>شاهد إعلاناً قصيراً واحصل على 30 نقطة فوراً.</Text>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#10B981'}]} onPress={() => addPoints(30, "مشاهدة إعلان")}>
              <Text style={styles.btnText}>مشاهدة الإعلان (+30)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>👥 نظام الإحالة (دعوة الأصدقاء)</Text>
            <Text style={styles.cardDesc}>شارك كودك واكسب 100 نقطة لكل صديق يسجل:</Text>
            <Text style={styles.refCode}>{referralCode}</Text>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'wallet' && (
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>طلب سحب الأرباح</Text>
            <TextInput 
              style={styles.input} 
              placeholder="رقم RIP (بريدي موب) أو عنوان Binance / RedotPay" 
              placeholderTextColor="#888"
              onChangeText={setWithdrawAddress}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={() => handleWithdraw('BaridiMob')}>
              <Text style={styles.btnText}>سحب عبر BaridiMob 🇩🇿</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#EF4444', marginTop: 8}]} onPress={() => handleWithdraw('RedotPay')}>
              <Text style={styles.btnText}>سحب عبر RedotPay 🔴</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'profile' && (
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>معلومات الحساب</Text>
            <Text style={styles.profileText}>البريد: {userEmail || "user@paypop.com"}</Text>
            <Text style={styles.profileText}>معرف الحساب: #88492</Text>
            <Text style={styles.profileText}>حالة الـ VPN: غير مفعل (آمن) ✅</Text>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#DC2626', marginTop: 15}]} onPress={() => setCurrentScreen('login')}>
              <Text style={styles.btnText}>تسجيل الخروج</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentScreen !== 'login' && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={[styles.navText, currentScreen === 'home' && styles.activeNav]}>الرئيسية</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('earn')}>
            <Text style={[styles.navText, currentScreen === 'earn' && styles.activeNav]}>اربح</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('wallet')}>
            <Text style={[styles.navText, currentScreen === 'wallet' && styles.activeNav]}>المحفظة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('profile')}>
            <Text style={[styles.navText, currentScreen === 'profile' && styles.activeNav]}>حسابي</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  header: { backgroundColor: '#6C5CE7', padding: 15, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  badge: { backgroundColor: '#5A4BCF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  authContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  appTitle: { fontSize: 36, fontWeight: 'bold', color: '#6C5CE7', textAlign: 'center' },
  subTitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  content: { padding: 15 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 8, textAlign: 'right' },
  cardDesc: { color: '#64748B', fontSize: 13, textAlign: 'right', marginBottom: 10 },
  pointsText: { fontSize: 32, fontWeight: 'bold', color: '#6C5CE7', textAlign: 'center', marginVertical: 8 },
  subPoints: { textAlign: 'center', color: '#94A3B8', fontSize: 12 },
  primaryBtn: { backgroundColor: '#6C5CE7', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 12, textAlign: 'right', fontSize: 14 },
  refCode: { fontSize: 18, fontWeight: 'bold', color: '#6C5CE7', textAlign: 'center', backgroundColor: '#F1F5F9', padding: 10, borderRadius: 8, letterSpacing: 2 },
  profileText: { fontSize: 14, color: '#334155', marginVertical: 4, textAlign: 'right' },
  bottomNav: { flexDirection: 'row-reverse', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E2E8F0', height: 60 },
  navBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { fontSize: 13, color: '#64748B', fontWeight: 'bold' },
  activeNav: { color: '#6C5CE7' }
});
