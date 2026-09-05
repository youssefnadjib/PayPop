import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, SafeAreaView, StatusBar, TextInput, Modal } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isSignUp, setIsSignUp] = useState(false);
  const [points, setPoints] = useState(1250);
  const [userEmail, setUserEmail] = useState('');
  const [spinCooldown, setSpinCooldown] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [userAvatar, setUserAvatar] = useState('👤');
  const [referralModalVisible, setReferralModalVisible] = useState(false);
  const referralCode = "PAYPOP-8849";

  const emojisList = ['😎', '🦊', '⚡', '🎮', '🦁'];

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
      Alert.alert("خطأ", "يرجى كتابة رقم الحساب أو البريد أو المعرف الخاص بك للسحب.");
      return;
    }
    Alert.alert("تم إرسال الطلب ⏳", `سيتم تحويل المبلغ أو الجوائز عبر ${method} إلى: ${withdrawAddress} خلال 24 ساعة.`);
  };

  const handleCameraAction = () => {
    Alert.alert(
      "تغيير صورة الحساب",
      "اختر طريقة تغيير الصورة:",
      [
        { text: "التقاط بالكاميرا 📷", onPress: () => Alert.alert("الكاميرا", "قريباً: فتح الكاميرا التقاط صورة.") },
        { text: "اختيار من المعرض 🖼️", onPress: () => Alert.alert("المعرض", "قريباً: اختيار صورة من ملفات الهاتف.") },
        { text: "إلغاء", style: "cancel" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#5849E2" barStyle="light-content" />
      
      {currentScreen !== 'splash' && currentScreen !== 'login' && (
        <View style={styles.header}>
          <Text style={styles.logo}>PayPop ⚡</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{points} نقطة (${(points/1000).toFixed(2)})</Text>
          </View>
        </View>
      )}

      {currentScreen === 'splash' && (
        <View style={styles.splashContainer}>
          <View style={styles.splashCard}>
            <Text style={styles.splashGiftIcon}>🎁🔥</Text>
            <Text style={styles.splashTitle}>PayPop</Text>
            <Text style={styles.splashDesc}>طريقتك الأذكية لجمع الأرباح، شدات الألعاب، وسحب الأموال بكل سهولة.</Text>
            
            <TouchableOpacity style={styles.splashBtn} onPress={() => setCurrentScreen('login')}>
              <Text style={styles.splashBtnText}>ابدأ الآن 🚀</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentScreen === 'login' && (
        <ScrollView contentContainerStyle={styles.authContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.authGiftIcon}>🎁</Text>
            <Text style={styles.appTitle}>PayPop</Text>
          </View>
          <Text style={styles.subTitle}>
            {isSignUp ? "أنشئ حساباً جديداً وابدأ الربح" : "سجل دخولك وابدأ جمع الأرباح"}
          </Text>

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

          {!isSignUp && (
            <TouchableOpacity style={styles.forgotBtn} onPress={() => Alert.alert("استعادة كلمة السر", "تم إرسال رابط الاستعادة إلى بريدك.")}>
              <Text style={styles.forgotText}>نسيت كلمة السر؟</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.primaryBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={styles.btnText}>{isSignUp ? "إنشاء الحساب" : "تسجيل الدخول"}</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>أو المتابعة عبر</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={styles.googleBtnText}>🌐 المتابعة باستخدام Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.facebookBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={styles.facebookBtnText}>📘 المتابعة باستخدام Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchAuthBtn} onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchAuthText}>
              {isSignUp ? "لديك حساب بالفعل؟ تسجيل الدخول" : "ليس لديك حساب؟ إنشاء حساب جديد"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.privacyContainer} onPress={() => Alert.alert("سياسة الخصوصية", "نحن نحترم خصوصيتك ونحمي بياناتك وفقاً للمعايير الدولية.")}>
            <Text style={styles.privacyText}>
              بالتسجيل أنت توافق على <Text style={styles.privacyLink}>سياسة الخصوصية</Text> و <Text style={styles.privacyLink}>شروط الاستخدام</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {currentScreen === 'home' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 لوحة التحكم (Dashboard)</Text>
            <Text style={styles.pointsText}>{points} نقطة</Text>
            <Text style={styles.subPoints}>تساوي ${(points/1000).toFixed(2)} دولار أمريكي</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>150</Text>
              <Text style={styles.statLabel}>ما جمعت اليوم</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>الأصدقاء المدعوون</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 التحدي اليومي</Text>
            <Text style={styles.cardDesc}>ادخل كل يوم وأقسح هدية التسجيل اليومي (+50 نقطة)</Text>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#F59E0B'}]} onPress={() => addPoints(50, "هدية التحدي اليومي")}>
              <Text style={styles.btnText}>استلام الهدية اليومية</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'earn' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎬 مشاهدة إعلان (AdMob)</Text>
            <Text style={styles.cardDesc}>شاهد إعلاناً قصيراً واحصل على 30 نقطة فوراً.</Text>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#10B981'}]} onPress={() => addPoints(30, "مشاهدة إعلان")}>
              <Text style={styles.btnText}>مشاهدة الإعلان (+30)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🌀 عجلة الحظ اليومية</Text>
            <Text style={styles.cardDesc}>أدر العجلة مرة كل 24 ساعة واربح بين 10 و 100 نقطة.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={spinWheel}>
              <Text style={styles.btnText}>{spinCooldown ? "عد غداً للتدوير" : "أدر العجلة الآن"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>💡 استطلاع Opinions (أسئلة خفيفة)</Text>
            <Text style={styles.cardDesc}>سؤال ثقافي خفيف جاوب عليه واربح نقاط فورية.</Text>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#6366F1'}]} onPress={() => addPoints(20, "استطلاع الرأي")}>
              <Text style={styles.btnText}>الإجابة على السؤال (+20)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'wallet' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💳 طلب سحب الأرباح والجوائز</Text>
            <TextInput 
              style={styles.input} 
              placeholder="رقم RIP / إيميل بايبال / عنوان Binance / ID اللعبة" 
              placeholderTextColor="#888"
              onChangeText={setWithdrawAddress}
            />
            
            <TouchableOpacity style={[styles.withdrawOptionBtn, {backgroundColor: '#006633'}]} onPress={() => handleWithdraw('BaridiMob')}>
              <Text style={styles.withdrawBtnText}>🇩🇿 BaridiMob (بريدي موب)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.withdrawOptionBtn, {backgroundColor: '#EF4444'}]} onPress={() => handleWithdraw('RedotPay')}>
              <Text style={styles.withdrawBtnText}>🔴 RedotPay (بطاقة افتراضية)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.withdrawOptionBtn, {backgroundColor: '#0070BA'}]} onPress={() => handleWithdraw('PayPal')}>
              <Text style={styles.withdrawBtnText}>🅿️ PayPal (بايبال)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.withdrawOptionBtn, {backgroundColor: '#F3BA2F'}]} onPress={() => handleWithdraw('Binance')}>
              <Text style={[styles.withdrawBtnText, {color: '#000'}]}>🟡 Binance (بايننس كريبتو)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.withdrawOptionBtn, {backgroundColor: '#FF7300'}]} onPress={() => handleWithdraw('Free Fire Gems')}>
              <Text style={styles.withdrawBtnText}>💎 جواهر فري فاير (Free Fire)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.withdrawOptionBtn, {backgroundColor: '#2E3192'}]} onPress={() => handleWithdraw('PUBG UC')}>
              <Text style={styles.withdrawBtnText}>🎮 شدات ببجي موبايل (PUBG UC)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'profile' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileHeaderCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{userAvatar}</Text>
              </View>
              <TouchableOpacity style={styles.cameraIconBtn} onPress={handleCameraAction}>
                <Text style={styles.cameraIconText}>📷</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.profileName}>{userEmail ? userEmail.split('@')[0] : "Youssef Gamer"}</Text>
            <Text style={styles.profileEmail}>{userEmail || "user@paypop.com"}</Text>

            <Text style={styles.emojiPickerTitle}>أو اختر رمزاً سريعاً:</Text>
            <View style={styles.emojisRow}>
              {emojisList.map((emo, index) => (
                <TouchableOpacity key={index} style={styles.emojiOption} onPress={() => setUserAvatar(emo)}>
                  <Text style={styles.emojiItem}>{emo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setReferralModalVisible(true)}>
              <Text style={styles.btnText}>👥 نظام الإحالة ودعوة الأصدقاء</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>إعدادات التطبيق والحساب</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("الإعدادات", "تخصيص الإشعارات والمظهر قريباً.")}>
              <Text style={styles.menuArrow}>⬅</Text>
              <Text style={styles.menuText}>⚙️ إعدادات التطبيق</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("اللغة", "اللغة الحالية: العربية.")}>
              <Text style={styles.menuArrow}>⬅</Text>
              <Text style={styles.menuText}>🌐 اللغة (Language)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("مركز الدعم", "تواصل معنا مباشرة لحل أي مشكلة.")}>
              <Text style={styles.menuArrow}>⬅</Text>
              <Text style={styles.menuText}>🎧 مركز الدعم والمساعدة</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => setCurrentScreen('login')}>
            <Text style={styles.logoutBtnText}>تسجيل الخروج 🚪</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={referralModalVisible}
        onRequestClose={() => setReferralModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.cardTitle}>👥 دعوة الأصدقاء (Referral)</Text>
            <Text style={styles.cardDesc}>شارك كودك الخاص واكسب 100 نقطة عن كل صديق يسجل:</Text>
            <Text style={styles.refCode}>{referralCode}</Text>
            
            <TouchableOpacity 
              style={[styles.primaryBtn, {backgroundColor: '#10B981', marginTop: 15}]} 
              onPress={() => {
                Alert.alert("تم النسخ", "تم نسخ كود الإحالة بنجاح!");
                setReferralModalVisible(false);
              }}
            >
              <Text style={styles.btnText}>📋 نسخ الكود</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.primaryBtn, {backgroundColor: '#25D366', marginTop: 8}]} 
              onPress={() => {
                Alert.alert("مشاركة", "فتح مشاركة واتساب / تيليجرام...");
                setReferralModalVisible(false);
              }}
            >
              <Text style={styles.btnText}>💬 مشاركة عبر واتساب / تيليجرام</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.primaryBtn, {backgroundColor: '#EF4444', marginTop: 15}]} 
              onPress={() => setReferralModalVisible(false)}
            >
              <Text style={styles.btnText}>إغلاق النافذة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {currentScreen !== 'splash' && currentScreen !== 'login' && (
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#5849E2', padding: 15, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  badge: { backgroundColor: '#4738C4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  
  splashContainer: { flex: 1, backgroundColor: '#5849E2', justifyContent: 'center', alignItems: 'center', padding: 20 },
  splashCard: { width: '100%', backgroundColor: 'white', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 10 },
  splashGiftIcon: { fontSize: 50, marginBottom: 15 },
  splashTitle: { fontSize: 36, fontWeight: 'bold', color: '#5849E2', marginBottom: 10 },
  splashDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  splashBtn: { backgroundColor: '#5849E2', width: '100%', padding: 14, borderRadius: 10, alignItems: 'center' },
  splashBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  authContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  logoBox: { flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  authGiftIcon: { fontSize: 32, marginLeft: 8 },
  appTitle: { fontSize: 36, fontWeight: 'bold', color: '#5849E2', textAlign: 'center' },
  subTitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 20 },
  scrollContent: { padding: 15, paddingBottom: 80 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, textAlign: 'right' },
  cardDesc: { color: '#64748B', fontSize: 13, textAlign: 'right', marginBottom: 10 },
  pointsText: { fontSize: 32, fontWeight: 'bold', color: '#5849E2', textAlign: 'center', marginVertical: 8 },
  subPoints: { textAlign: 'center', color: '#94A3B8', fontSize: 12 },
  statsRow: { flexDirection: 'row-reverse', gap: 10, marginBottom: 15 },
  statBox: { flex: 1, backgroundColor: 'white', padding: 15, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#5849E2', marginBottom: 5 },
  statLabel: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  primaryBtn: { backgroundColor: '#5849E2', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  withdrawOptionBtn: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  withdrawBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 12, textAlign: 'right', fontSize: 14 },
  forgotBtn: { alignSelf: 'flex-start', marginBottom: 15 },
  forgotText: { color: '#5849E2', fontSize: 13 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  line: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  orText: { marginHorizontal: 10, color: '#888', fontSize: 12 },
  googleBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  googleBtnText: { color: '#1E293B', fontWeight: 'bold', fontSize: 14 },
  facebookBtn: { backgroundColor: '#1877F2', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  facebookBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  switchAuthBtn: { alignItems: 'center', marginTop: 10 },
  switchAuthText: { color: '#5849E2', fontSize: 14, fontWeight: 'bold' },
  
  privacyContainer: { marginTop: 25, alignItems: 'center', paddingHorizontal: 10 },
  privacyText: { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 16 },
  privacyLink: { color: '#5849E2', fontWeight: 'bold' },

  refCode: { fontSize: 18, fontWeight: 'bold', color: '#5849E2', textAlign: 'center', backgroundColor: '#F1F5F9', padding: 10, borderRadius: 8, letterSpacing: 2 },
  profileHeaderCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 15, alignItems: 'center', elevation: 2 },
  avatarContainer: { position: 'relative', marginBottom: 10 },
  avatarCircle: { width: 75, height: 75, borderRadius: 37.5, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#5849E2' },
  avatarText: { fontSize: 34 },
  cameraIconBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#5849E2', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'white' },
  cameraIconText: { fontSize: 12 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  profileEmail: { fontSize: 13, color: '#64748B', marginTop: 2, marginBottom: 15 },
  emojiPickerTitle: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  emojisRow: { flexDirection: 'row-reverse', justifyContent: 'center', gap: 8 },
  emojiOption: { backgroundColor: '#F1F5F9', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  emojiItem: { fontSize: 18 },
  menuItem: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  menuText: { fontSize: 15, color: '#334155', fontWeight: 'bold' },
  menuArrow: { color: '#94A3B8', fontSize: 16 },
  logoutBtn: { backgroundColor: '#DC2626', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  logoutBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', width: '100%', padding: 20, borderRadius: 12, elevation: 5 },
  bottomNav: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    flexDirection: 'row-reverse', 
    backgroundColor: 'white', 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0', 
    height: 60,
    elevation: 10,
    zIndex: 100
  },
  navBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { fontSize: 13, color: '#64748B', fontWeight: 'bold' },
  activeNav: { color: '#5849E2' }
});

