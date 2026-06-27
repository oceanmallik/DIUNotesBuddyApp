import { useEffect, useState } from 'react';
import {
    AdEventType,
    InterstitialAd,
    TestIds,
} from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-7117924360439036/9935580825';

const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: true,
});

export default function useInterstitialAd() {
  const [loaded, setLoaded] = useState(interstitial.loaded);

  useEffect(() => {
    const onLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const onClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      interstitial.load(); // preload next ad after user closes
    });
    if (!interstitial.loaded) {
      interstitial.load(); // start loading immediately
    }
    return () => {
      onLoaded();
      onClosed();
    };
  }, []);

  const showAd = () => {
    if (loaded) {
      interstitial.show();
    }
  };

  return { showAd, loaded };
}