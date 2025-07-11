import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';


const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationFinish: () => void;
}

const SplashScreenAnimated: React.FC<SplashScreenProps> = ({ onAnimationFinish }) => {
  const ballX = useSharedValue(-100); // Start off-screen (left)
  const ballY = useSharedValue(height / 2 - 50); // Start at mid-height
  const ballRadius = useSharedValue(50); // Initial size
  const backgroundColor = useSharedValue('#FFFFFF'); // Default background

  useEffect(() => {
    // Animate bounce from left to center
    ballX.value = withSequence(
      withTiming(width / 3, { duration: 500, easing: Easing.out(Easing.exp) }), // First stop (near left-center)
      withTiming(width / 2 - 50, { duration: 400, easing: Easing.out(Easing.bounce) }), // Bounce to center
    );

    // Simulate bounce vertically
    ballY.value = withSequence(
      withDelay(500, withTiming(height / 2 - 80, { duration: 300, easing: Easing.out(Easing.exp) })), // Upward bounce
      withTiming(height / 2 - 50, { duration: 300, easing: Easing.in(Easing.bounce) }) // Downward bounce
    );

    // Once bounce completes, expand the ball and change the background
    setTimeout(() => {
      ballRadius.value = withTiming(width * 2.5, { duration: 1000, easing: Easing.out(Easing.exp) });
      backgroundColor.value = withTiming('#FFCDD2', { duration: 1000 }, () => {
        runOnJS(onAnimationFinish)(); // Proceed to the main app
      });
    }, 1000); // Start expansion after the bounce animation finishes
  }, []);

  // Ball animation style
  const ballStyle = useAnimatedStyle(() => {
    return {
      width: ballRadius.value,
      height: ballRadius.value,
      borderRadius: ballRadius.value / 2,
      backgroundColor: '#FF0000',
      position: 'absolute',
      left: ballRadius.value > 50 ? width / 2 - ballRadius.value / 2 : ballX.value,
      top: ballRadius.value > 50 ? height / 2 - ballRadius.value / 2 : ballY.value,
    };
  });

  // Background animation style
  const backgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });

  return (
    <Animated.View style={[styles.container, backgroundStyle]}>
      <Animated.View style={ballStyle} />
      <Image 
        source={require("@/assets/images/icon.png")} 
        style={styles.icon} 
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  icon: {
    width: 100,
    height: 100,
    zIndex: 1,
  },
});

export default SplashScreenAnimated;
