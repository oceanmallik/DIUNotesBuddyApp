import { useEffect, useState } from 'react';
import {
    AdEventType,
    RewardedAd,
    RewardedAdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-7117924360439036/8083891186';

const rewarded = RewardedAd.createForAdRequest(AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: true,
});

export default function useRewardedAd() {
  const [loaded, setLoaded] = useState(rewarded.loaded);

  useEffect(() => {
    const onLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const onClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      rewarded.load(); // preload next ad after user closes
    });

    if (!rewarded.loaded) {
      rewarded.load(); // start loading immediately
    }

    return () => {
      onLoaded();
      onClosed();
    };
  }, []);

  const showAd = (onRewardCallback) => {
    if (loaded) {
      // Add one-time listener for the reward
      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          if (onRewardCallback) onRewardCallback();
          unsubscribeEarned(); // clean up immediately after reward
        }
      );
      
      // Also need to clean up the listener if the user closes without finishing
      const unsubscribeClosed = rewarded.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          unsubscribeEarned();
          unsubscribeClosed();
        }
      );

      rewarded.show();
    } else {
      // If not loaded, we could optionally call onRewardCallback immediately 
      // or show an error. We'll just load it.
      rewarded.load();
    }
  };

  return { showAd, loaded };
}
