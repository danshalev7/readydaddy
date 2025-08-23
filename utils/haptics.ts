/**
 * Triggers haptic feedback if the browser supports the Vibration API.
 * @param pattern A vibration pattern. Defaults to a single 50ms pulse, suitable for light feedback.
 */
export const triggerHapticFeedback = (pattern: VibratePattern = 50) => {
  if (window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (error) {
      // Could fail if pattern is invalid, etc.
      console.error("Haptic feedback failed:", error);
    }
  }
};
