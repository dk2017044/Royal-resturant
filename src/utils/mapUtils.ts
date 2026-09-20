/**
 * Map utilities for opening native map apps:
 * - iOS: Apple Maps (maps:// or https://maps.apple.com)
 * - Android: Google Maps App (geo: intent or https://maps.google.com)
 * - Desktop: Google Maps web search
 */

const RESTAURANT_QUERY = encodeURIComponent("The Royal Rasoi, City Court, Sadikpur, Patna, Bihar 800007");
const RESTAURANT_LAT = 25.6022;
const RESTAURANT_LNG = 85.1956;

export const isIOSDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

export const isAndroidDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /Android/.test(navigator.userAgent);
};

export const getDeviceMapUrl = (): string => {
  if (isIOSDevice()) {
    return `https://maps.apple.com/?q=The+Royal+Rasoi&ll=${RESTAURANT_LAT},${RESTAURANT_LNG}&address=Sadikpur,Patna`;
  }
  if (isAndroidDevice()) {
    return `https://maps.google.com/?q=${RESTAURANT_QUERY}&ll=${RESTAURANT_LAT},${RESTAURANT_LNG}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${RESTAURANT_QUERY}`;
};

export const openDeviceMap = (e?: React.MouseEvent): void => {
  if (e) {
    e.preventDefault();
  }

  if (isIOSDevice()) {
    // Open Apple Maps on iOS devices
    window.location.href = `maps://maps.apple.com/?q=The+Royal+Rasoi&ll=${RESTAURANT_LAT},${RESTAURANT_LNG}&address=Sadikpur,Patna`;
    // Fallback if maps:// protocol does not open in 400ms
    setTimeout(() => {
      window.open(
        `https://maps.apple.com/?q=The+Royal+Rasoi&ll=${RESTAURANT_LAT},${RESTAURANT_LNG}`,
        "_blank"
      );
    }, 400);
    return;
  }

  if (isAndroidDevice()) {
    // Open native Google Maps app via geo: intent on Android
    window.location.href = `geo:${RESTAURANT_LAT},${RESTAURANT_LNG}?q=${RESTAURANT_QUERY}`;
    setTimeout(() => {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${RESTAURANT_QUERY}`,
        "_blank"
      );
    }, 400);
    return;
  }

  // Desktop / other
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${RESTAURANT_QUERY}`,
    "_blank",
    "noopener,noreferrer"
  );
};
