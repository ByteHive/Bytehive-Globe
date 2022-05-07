console.log("loaded Fucntions.js");
function clamp(num, min, max) {
    return num <= min ? min : (num >= max ? max : num);
  }

function getRandomColor() {
var letters = '0123456789ABCDEF';
var color = '#';
for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
}
return color;
}

function coordinateToPosition(lat, lng, radius) {
const phi = (90 - lat) * DEGREE_TO_RADIAN;
const theta = (lng + 180) * DEGREE_TO_RADIAN;

return new THREE.Vector3(
    - radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
);
}

function getSplineFromCoords(coords) {
    const startLat = coords[0],startLng = coords[1], endLat = coords[2],endLng = coords[3];
    // start and end points
    const start = coordinateToPosition(startLat, startLng, GLOBE_RADIUS);
    const end = coordinateToPosition(endLat, endLng, GLOBE_RADIUS);
    
    // altitude
    const altitude = clamp(start.distanceTo(end) * .75, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);
    
    // 2 control points
    const interpolate = geoInterpolate([startLng, startLat], [endLng, endLat]);
    const midCoord1 = interpolate(0.25),midCoord2 = interpolate(0.75);
    const mid1 = coordinateToPosition(midCoord1[1], midCoord1[0], GLOBE_RADIUS + altitude);
    const mid2 = coordinateToPosition(midCoord2[1], midCoord2[0], GLOBE_RADIUS + altitude);
  
    return new THREE.CubicBezierCurve3(start, mid1, mid2, end);
  }