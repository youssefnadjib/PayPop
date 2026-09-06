// ======================================================
// PayPop Wheel — الجزء 13
// ======================================================

import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  G,
  Line,
  Polygon,
  Text as SvgText,
} from "react-native-svg";

const PRIZES = [10, 15, 25, 10, 15, 10, 25, 15];

const COLORS = [
  "#6D5DFB",
  "#8B5CF6",
  "#4F46E5",
  "#A855F7",
  "#6366F1",
  "#7C3AED",
  "#5B21B6",
  "#9333EA",
];

const SIZE = 290;
const CENTER = SIZE / 2;
const RADIUS = 130;
const SEGMENTS = PRIZES.length;
const SEGMENT_ANGLE = 360 / SEGMENTS;

const Wheel = ({
  onReward,
  disabled = false,
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showWin, setShowWin] = useState(false);

  const spin = () => {
    if (spinning || disabled) return;

    setSpinning(true);
    setResult(null);
    setShowWin(false);

    // اختيار الجائزة أولاً
    // ثم حساب الدوران حتى تهبط نفس الخانة تحت المؤشر
    const targetIndex = Math.floor(
      Math.random() * PRIZES.length
    );

    const prize = PRIZES[targetIndex];

    const extraRounds = 5 + Math.floor(Math.random() * 3);

    // مركز كل خانة
    const targetAngle =
      targetIndex * SEGMENT_ANGLE +
      SEGMENT_ANGLE / 2;

    // المؤشر في الأعلى = 270°
    const finalRotation =
      extraRounds * 360 +
      (360 - targetAngle + 270) % 360;

    Animated.timing(rotation, {
      toValue: finalRotation,
      duration: 4200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // الجائزة محفوظة من بداية الدوران
      setResult(prize);
      setShowWin(true);
      setSpinning(false);

      if (typeof onReward === "function") {
        onReward(prize);
      }

      // إخفاء رسالة الفوز بعد مدة
      setTimeout(() => {
        setShowWin(false);
      }, 2500);
    });
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const createSegmentPoints = (index) => {
    const startAngle =
      (index * SEGMENT_ANGLE - 90) *
      (Math.PI / 180);

    const endAngle =
      ((index + 1) * SEGMENT_ANGLE - 90) *
      (Math.PI / 180);

    const x1 =
      CENTER + RADIUS * Math.cos(startAngle);

    const y1 =
      CENTER + RADIUS * Math.sin(startAngle);

    const x2 =
      CENTER + RADIUS * Math.cos(endAngle);

    const y2 =
      CENTER + RADIUS * Math.sin(endAngle);

    return `${CENTER},${CENTER} ${x1},${y1} ${x2},${y2}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.wheelWrapper}>
        {/* المؤشر */}
        <View style={styles.pointer}>
          <View style={styles.pointerTriangle} />
        </View>

        <Animated.View
          style={{
            transform: [{ rotate }],
          }}
        >
          <Svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
          >
            {/* خلفية */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS + 8}
              fill="#0E1020"
              stroke="#FFD76A"
              strokeWidth="5"
            />

            <G>
              {PRIZES.map((prize, index) => {
                const middleAngle =
                  (index * SEGMENT_ANGLE +
                    SEGMENT_ANGLE / 2 -
                    90) *
                  (Math.PI / 180);

                const textRadius = 88;

                const textX =
                  CENTER +
                  textRadius *
                    Math.cos(middleAngle);

                const textY =
                  CENTER +
                  textRadius *
                    Math.sin(middleAngle);

                return (
                  <G key={index}>
                    <Polygon
                      points={createSegmentPoints(index)}
                      fill={COLORS[index]}
                      stroke="#FFFFFF"
                      strokeOpacity="0.15"
                      strokeWidth="1"
                    />

                    <SvgText
                      x={textX}
                      y={textY}
                      fill="#FFFFFF"
                      fontSize="17"
                      fontWeight="900"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${
                        index * SEGMENT_ANGLE +
                        SEGMENT_ANGLE / 2
                      } ${textX} ${textY})`}
                    >
                      {String(prize)}
                    </SvgText>
                  </G>
                );
              })}
            </G>

            {/* الحافة */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="#FFD76A"
              strokeWidth="4"
            />

            {/* المركز */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r="38"
              fill="#111425"
              stroke="#FFD76A"
              strokeWidth="4"
            />

            <Circle
              cx={CENTER}
              cy={CENTER}
              r="29"
              fill="#6D5DFB"
            />

            <SvgText
              x={CENTER}
              y={CENTER - 2}
              fill="#FFD76A"
              fontSize="23"
              fontWeight="900"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              P
            </SvgText>

            <SvgText
              x={CENTER}
              y={CENTER + 17}
              fill="#FFFFFF"
              fontSize="7"
              fontWeight="900"
              textAnchor="middle"
            >
              PayPop
            </SvgText>
          </Svg>
        </Animated.View>
      </View>

      <View style={styles.titleArea}>
        <Text style={styles.title}>
          {spinning
            ? "PayPop..."
            : "Spin & Win"}
        </Text>

        <Text style={styles.subtitle}>
          {spinning
            ? "جاري الدوران..."
            : "اربح PayPop من العجلة"}
        </Text>
      </View>

      {showWin && result !== null && (
        <View style={styles.winBox}>
          <View style={styles.sparkles}>
            <Text>✦</Text>
            <Text>✧</Text>
            <Text>✦</Text>
          </View>

          <Text style={styles.winTitle}>
            🎉 مبروك!
          </Text>

          <Text style={styles.winReward}>
            +{result} PayPop
          </Text>

          <Text style={styles.winText}>
            تمت إضافة المكافأة إلى رصيدك
          </Text>
        </View>
      )}

      <Pressable
        onPress={spin}
        disabled={spinning || disabled}
        style={[
          styles.spinButton,
          (spinning || disabled) &&
            styles.spinButtonDisabled,
        ]}
      >
        <Text style={styles.spinButtonText}>
          {spinning ? "جاري الدوران..." : "🎡 إربح الآن"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 15,
  },

  wheelWrapper: {
    width: SIZE,
    height: SIZE + 22,
    alignItems: "center",
    justifyContent: "center",
  },

  pointer: {
    position: "absolute",
    top: -1,
    zIndex: 20,
    alignItems: "center",
  },

  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderTopWidth: 27,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFD76A",
  },

  titleArea: {
    alignItems: "center",
    marginTop: 4,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  subtitle: {
    color: "#858CA1",
    fontSize: 11,
    marginTop: 5,
  },

  winBox: {
    marginTop: 13,
    minWidth: 220,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: "rgba(109,93,251,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,215,106,0.28)",
    alignItems: "center",
  },

  sparkles: {
    position: "absolute",
    top: 5,
    left: 14,
    right: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  winTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  winReward: {
    color: "#FFD76A",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 3,
  },

  winText: {
    color: "#858CA1",
    fontSize: 10,
    marginTop: 2,
  },

  spinButton: {
    marginTop: 17,
    minWidth: 210,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#6D5DFB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  spinButtonDisabled: {
    opacity: 0.5,
  },

  spinButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});

export default Wheel;

// ======================================================
// الجزء 13 انتهى
// ======================================================
