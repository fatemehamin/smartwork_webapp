const checkLocation = (checkPoint, coordinate, meter) => {
  const ky = 40000 / 360;
  const kx = Math.cos((Math.PI * coordinate.latitude) / 180.0) * ky;
  const dx = Math.abs(coordinate.longitude - checkPoint.longitude) * kx;
  const dy = Math.abs(coordinate.latitude - checkPoint.latitude) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= meter / 1000;
};

export default checkLocation;
