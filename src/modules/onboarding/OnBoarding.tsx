import React from 'react';
import {StyleSheet, View} from 'react-native';
import OnboardingCarousel, {
  OnboardingSlide,
} from '../../components/OnboardingCarousel';
import {strings} from '../../constants/strings';

const onboardingIcon1 = require('../../assets/images/onboarding-icon1.png');
const onboardingIcon2 = require('../../assets/images/onboarding-icon2.png');
const onboardingIcon3 = require('../../assets/images/onboarding-icon3.png');

const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: strings.onboardingTitle1,
    description: strings.onboardingDescription1,
    image: onboardingIcon1,
  },
  {
    id: '2',
    title: strings.onboardingTitle2,
    description: strings.onboardingDescription2,
    image: onboardingIcon2,
  },
  {
    id: '3',
    title: strings.onboardingTitle3,
    description: strings.onboardingDescription3,
    image: onboardingIcon3,
  },
];

const OnBoarding = () => {
  const handleFinish = () => {
    console.log('Onboarding finished');
  };

  const handleSkip = () => {
    console.log('Onboarding skipped');
  };

  return (
    <View style={styles.container}>
      <OnboardingCarousel
        slides={onboardingSlides}
        onFinish={handleFinish}
        onSkip={handleSkip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default OnBoarding;
