import { useEffect, useState } from "react";

export enum DeviceType {
  Mobile = "mobile",
  Tablet = "tablet",
  Desktop = "desktop",
}

const getDeviceType = (width: number): DeviceType => {
  if (width < 768) {
    return DeviceType.Mobile;
  }
  if (width >= 768 && width < 1024) {
    return DeviceType.Tablet;
  }
  return DeviceType.Desktop;
};

const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.Desktop);

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType(window.innerWidth));
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceType;
};

export default useDeviceType;
