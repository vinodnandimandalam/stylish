import React, {useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';
import {
  Carousel,
  Pagination,
  type CarouselRef,
  type CarouselRenderItem,
} from 'react-native-reanimated-carousel';
import {strings} from '../constants/strings';
import {colors} from '../theme/colors';

const {width} = Dimensions.get('window');

export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
};

type OnboardingCarouselProps = {
  slides: OnboardingSlide[];
  onFinish: () => void;
  onSkip?: () => void;
};

const OnboardingCarousel = ({
  slides,
  onFinish,
}: OnboardingCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<CarouselRef>(null);
  const progress = useSharedValue(0);

  const isLastSlide = currentIndex === slides.length - 1;

  const handlePrev = () => {
    if (currentIndex === 0) {
      return;
    }

    const prevIndex = currentIndex - 1;
    carouselRef.current?.scrollTo({
      index: prevIndex,
      animated: true,
    });
  };

  const handleSkip = () => {
    onFinish();
  };

  const handleNext = () => {
    if (isLastSlide) {
      onFinish();
      return;
    }

    const nextIndex = currentIndex + 1;
    carouselRef.current?.scrollTo({
      index: nextIndex,
      animated: true,
    });
  };

  const renderItem: CarouselRenderItem<OnboardingSlide> = ({item}) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.slideCounter}>{`${currentIndex + 1}/${slides.length}`}</Text>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>{strings.onboardingSkip}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentArea}>
          <Carousel
            ref={carouselRef}
            style={{width, height: width * 1.15}}
            data={slides}
            progress={progress}
            loop={false}
            snapMode="page"
            animation={{type: 'timing', duration: 500}}
            onSnapToItem={(index: number) => setCurrentIndex(index)}
            renderItem={renderItem}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.prevButton}
            onPress={handlePrev}
            disabled={currentIndex === 0}>
            <Text style={[styles.navText, currentIndex === 0 && styles.disabledText]}>
              {strings.onboardingPrev}
            </Text>
          </TouchableOpacity>

          <Pagination
            count={slides.length}
            progress={progress}
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
            containerStyle={styles.paginationContainer}
          />

          <TouchableOpacity style={styles.actionButton} onPress={handleNext}>
            <Text style={styles.actionText}>
              {isLastSlide ? strings.onboardingGetStarted : strings.onboardingNext}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingTop: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    marginTop: 4,
  },
  slideCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContent: {
    width: width * 3,
  },
  slide: {
    width,
    height: width * 1.15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  paginationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginHorizontal: 6,
    backgroundColor: colors.dotInactive,
  },
  activeDot: {
    width: 24,
    height: 10,
    borderRadius: 999,
    marginHorizontal: 6,
    backgroundColor: colors.dotActive,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginTop: 'auto',
  },
  prevButton: {
    minWidth: 70,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  navText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  disabledText: {
    color: colors.disabled,
  },
  actionButton: {
    minWidth: 90,
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  actionText: {
    color: colors.accentRed,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OnboardingCarousel;
