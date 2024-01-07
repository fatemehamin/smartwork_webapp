import { useEffect } from "react";
import { useMap } from "react-leaflet";
import Locate from "leaflet.locatecontrol";

const LocateControl = () => {
  const map = useMap();
  useEffect(() => {
    const locateOptions = {
      position: "topleft",
      maxZoom: 19,
      strings: {
        title: "Show me where I am, yo!",
      },
    };

    const lc = new Locate(locateOptions);
    lc.addTo(map);
    // return () => lc.remove();
  }, [map]);
  return null;
};
export default LocateControl;
