import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import Svg, {
  G,
  Path,
  Circle,
  Polygon,
  Text as SvgText,
} from 'react-native-svg';

const AnimatedView = Animated.createAnimatedComponent(View);

const SEGMENTS = [
  { value: 10, color: '#8B5CF6' },
  { value: 15, color: '#06B6D4' },
  { value: 10, color: '#EC4899' },
  { value: 25, color: '#F59E0B' },
  { value: 15, color: '#7C3AED' },
  { value: 10, color: '#14B8A6' },
  { value: 25, color: '#EF4444' },
  { value: 15, color: '#3B82F6' },
];

const SIZE = 270;
const CENTER = SIZE / 2;
const RADIUS = 125;

function polarToCartesian(cx, cy, r, angle) {
  const angleInRadians = ((angle - 90) * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function describeArc(startAngle, endAngle) {
  const start = polarToCartesian(
    CENTER,
    CENTER,
    RADIUS,
    endAngle
  );

  const end = polarToCartesian(
    CENTER,
    CENTER,
    RADIUS,
    startAngle
  );

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

export function WheelLogo({ size = 38 }) {
  const logoRadius = size / 2;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={logoRadius}
          cy={logoRadius}
          r={logoRadius - 2}
          fill="#6D28D9"
          stroke="#FBBF24"
          strokeWidth="2"
        />

        <Circle
          cx={logoRadius}
          cy={logoRadius}
          r={logoRadius * 0.55}
          fill="#A78BFA"
        />

        <Circle
          cx={logoRadius}
          cy={logoRadius}
          r={logoRadius * 0.22}
          fill="#FBBF24"
        />

        <Circle
          cx={logoRadius}
          cy={logoRadius}
          r={logoRadius * 0.1}
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
}

export default function Wheel({ onReward }) {
  const rotation = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;

    setSpinning(true);

    const extraRotation = 1440 + Math.floor(Math.random() * 720);

    animationRef.current = Animated.timing(rotation, {
      toValue: extraRotation,
      duration: 5000,
      useNativeDriver: true,
    });

    animationRef.current.start(({ finished }) => {
      if (finished) {
        const rewards = [10, 10, 10, 15, 15, 15, 25];
        const reward =
          rewards[Math.floor(Math.random() * rewards.length)];

        setSpinning(false);

        if (onReward) {
          onReward(reward);
        }
      }
    });
  };

  const stop = () => {
    if (!spinning) return;

    if (animationRef.current) {
      animationRef.current.stop();
    }

    setSpinning(false);

    const rewards = [10, 10, 10, 15, 15, 15, 25];
    const reward =
      rewards[Math.floor(Math.random() * rewards.length)];

    if (onReward) {
      onReward(reward);
    }
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🎡 عجلة تعدين توكنات PPT
      </Text>

      <Text style={styles.subtitle}>
        أدر العجلة واكتشف نصيبك من توكنات PayPop
      </Text>

      <View style={styles.wheelArea}>

        {/* السهم الذهبي */}
        <Svg
          width={45}
          height={55}
          style={styles.pointer}
        >
          <Polygon
            points="22,52 5,12 22,20 40,12"
            fill="#FBBF24"
            stroke="#92400E"
            strokeWidth="2"
          />
        </Svg>

        {/* العجلة */}
        <AnimatedView
          style={[
            styles.wheel,
            {
              transform: [{ rotate }],
            },
          ]}
        >
          <Svg width={SIZE} height={SIZE}>

            {/* الحافة الذهبية */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS + 8}
              fill="#FBBF24"
              stroke="#92400E"
              strokeWidth="3"
            />

            {/* القطع */}
            <G>
              {SEGMENTS.map((segment, index) => {
                const startAngle = index * 45;
                const endAngle = startAngle + 45;

                return (
                  <Path
                    key={index}
                    d={describeArc(startAngle, endAngle)}
                    fill={segment.color}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                );
              })}
            </G>

            {/* أرقام الجوائز */}
            {SEGMENTS.map((segment, index) => {
              const angle = index * 45 + 22.5;
              const pos = polarToCartesian(
                CENTER,
                CENTER,
                88,
                angle
              );

              return (
                <SvgText
                  key={`text-${index}`}
                  x={pos.x}
                  y={pos.y}
                  fill="#FFFFFF"
                  fontSize="19"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {segment.value}
                </SvgText>
              );
            })}

            {/* مركز PayPop */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r="38"
              fill="#4C1D95"
              stroke="#FBBF24"
              strokeWidth="4"
            />

            <SvgText
              x={CENTER}
              y={CENTER - 2}
              fill="#FFFFFF"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
            >
              PayPop
            </SvgText>

            <SvgText
              x={CENTER}
              y={CENTER + 15}
              fill="#FBBF24"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              PPT
            </SvgText>

            {/* نقاط ذهبية حول الحافة */}
            {[...Array(16)].map((_, index) => {
              const angle = index * 22.5;
              const pos = polarToCartesian(
                CENTER,
                CENTER,
                RADIUS + 3,
                angle
              );

              return (
                <Circle
                  key={`dot-${index}`}
                  cx={pos.x}
                  cy={pos.y}
                  r="3"
                  fill="#FFF7ED"
                />
              );
            })}

          </Svg>
        </AnimatedView>

      </View>

      <TouchableOpacity
        style={[
          styles.spinButton,
          spinning && styles.stopButton,
        ]}
        onPress={spinning ? stop : spin}
      >
        <Text style={styles.buttonText}>
          {spinning ? '⏹ أوقف العجلة' : '🎡 أدر العجلة واكسب PPT'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        {spinning
          ? 'العجلة تدور... أوقفها عندما تريد 🎯'
          : 'الجوائز: 10 / 15 / 25 PPT'}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B21B6',
    textAlign: 'center',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 15,
  },

  wheelArea: {
    width: SIZE,
    height: SIZE + 35,
    alignItems: 'center',
    justifyContent: 'center',
  },

  wheel: {
    width: SIZE,
    height: SIZE,
  },

  pointer: {
    position: 'absolute',
    top: -5,
    zIndex: 20,
  },

  spinButton: {
    backgroundColor: '#6D28D9',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 14,
    minWidth: '85%',
    alignItems: 'center',
    elevation: 4,
  },

  stopButton: {
    backgroundColor: '#EF4444',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  info: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
});
