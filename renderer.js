//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Drone Swarm
const yaw_1 = document.getElementById('yaw_1')
const roll_1 = document.getElementById('roll_1')
const pitch_1 = document.getElementById('pitch_1')

const yaw_2 = document.getElementById('yaw_2')
const roll_2 = document.getElementById('roll_2')
const pitch_2 = document.getElementById('pitch_2')

window.electronAPI.handleAttitude1((event, data) => {
  yaw_1.innerText = data.yaw
  roll_1.innerText = data.roll
  pitch_1.innerText = data.pitch
})

window.electronAPI.handleAttitude2((event, data) => {
  yaw_2.innerText = data.yaw
  roll_2.innerText = data.roll
  pitch_2.innerText = data.pitch
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const yaw = document.getElementById('yaw')
const roll = document.getElementById('roll')
const pitch = document.getElementById('pitch')

const comPortDropDownList = document.getElementById('comPortDropDownList')
const udpPortInput = document.getElementById('udpPort')
const baudRateDropDownList = document.getElementById('baudRateDropDownList')
const connectButton = document.getElementById('connectButton')

// Configure Parameters
const loiterZVelUpMax = document.getElementById('loiterZVelUpMax')
const loiterZVelDownMax = document.getElementById('loiterZVelDownMax')
const loiterXYVel = document.getElementById('loiterXYVel')
const landSpeed = document.getElementById('landSpeed')
const takeoffHeight = document.getElementById('takeoffHeight')
const loiterYawSpeed = document.getElementById('loiterYawSpeed')
const RTLAltitude = document.getElementById('RTLAltitude')
const waypointNavYawSpeed = document.getElementById('waypointNavYawSpeed')
const waypointNavSpeedMax = document.getElementById('waypointNavSpeedMax')
const weightOffset = document.getElementById('weightOffset')
const altitudeMax = document.getElementById('altitudeMax')
const distanceMax = document.getElementById('distanceMax')

// Altitude Control PID 
const RollP = document.getElementById('RollP')
const PitchP = document.getElementById('PitchP')
const YawP = document.getElementById('YawP')
const RollI = document.getElementById('RollI')
const PitchI = document.getElementById('PitchI')
const YawI = document.getElementById('YawI')
const RollD = document.getElementById('RollD')
const PitchD = document.getElementById('PitchD')
const YawD = document.getElementById('YawD')
const RollrD = document.getElementById('RollrD')
const PitchrD = document.getElementById('PitchrD')
const YawrD = document.getElementById('YawrD')
const RollImax = document.getElementById('RollImax')
const PitchImax = document.getElementById('PitchImax')
const YawImax = document.getElementById('YawImax')

// Position Control XYZ PID
const XP = document.getElementById('XP')
const YP = document.getElementById('YP')
const ZP = document.getElementById('ZP')
const XI = document.getElementById('XI')
const YI = document.getElementById('YI')
const ZI = document.getElementById('ZI')
const XD = document.getElementById('XD')
const YD = document.getElementById('YD')
const ZD = document.getElementById('ZD')
const XrD = document.getElementById('XrD')
const YrD = document.getElementById('YrD')
const ZrD = document.getElementById('ZrD')
const XPerrmax = document.getElementById('XPerrmax')
const YPerrmax = document.getElementById('YPerrmax')
const ZPerrmax = document.getElementById('ZPerrmax')
const XIerrmax = document.getElementById('XIerrmax')
const YIerrmax = document.getElementById('YIerrmax')
const ZIerrmax = document.getElementById('ZIerrmax')
const XDerrmax = document.getElementById('XDerrmax')
const YDerrmax = document.getElementById('YDerrmax')
const ZDerrmax = document.getElementById('ZDerrmax')
const XAerrmax = document.getElementById('XAerrmax')
const YAerrmax = document.getElementById('YAerrmax')
const ZAerrmax = document.getElementById('ZAerrmax')

// Config buttons
const readParameters = document.getElementById('readParameters')
const writeParameters = document.getElementById('writeParameters')
const loadDefault = document.getElementById('loadDefault')
const saveDefault = document.getElementById('saveDefault')

//Default values
let loiterZVelUpMaxDefault = 2.50
let loiterZVelDownMaxDefault = 1.50
let loiterXYVelDefault = 5.00
let landSpeedDefault = 0.50
let takeoffHeightDefault = 3.00
let loiterYawSpeedDefault = 1.50
let RTLAltitudeDefault = 5.00
let waypointNavYawSpeedDefault = 0.60  
let waypointNavSpeedMaxDefault = 5.00
let weightOffsetDefault = 0.00
let altitudeMaxDefault = 5.00
let distanceMaxDefault = 500.00

let RollPDefault = 70.00
let PitchPDefault = 70.00
let YawPDefault = 70.00
let RollIDefault = 70.00
let PitchIDefault = 70.00
let YawIDefault = 70.00
let RollDDefault = 70.00
let PitchDDefault = 70.00
let YawDDefault = 70.00
let RollrDDefault = 70.00
let PitchrDDefault = 70.00
let YawrDDefault = 70.00
let RollImaxDefault = 70.00
let PitchImaxDefault = 70.00
let YawImaxDefault = 70.00

let XPDefault = 70.00
let YPDefault = 70.00
let ZPDefault = 70.00
let XIDefault = 70.00
let YIDefault = 70.00
let ZIDefault = 70.00
let XDDefault = 70.00
let YDDefault = 70.00
let ZDDefault = 70.00
let XrDDefault = 70.00
let YrDDefault = 70.00
let ZrDDefault = 70.00
let XPerrmaxDefault = 70.00
let YPerrmaxDefault = 70.00
let ZPerrmaxDefault = 70.00
let XIerrmaxDefault = 70.00
let YIerrmaxDefault = 70.00
let ZIerrmaxDefault = 70.00
let XDerrmaxDefault = 70.00
let YDerrmaxDefault = 70.00
let ZDerrmaxDefault = 70.00
let XAerrmaxDefault = 70.00
let YAerrmaxDefault = 70.00
let ZAerrmaxDefault = 70.00

// Update comPortDropDownList with available com ports //////////////////////////////////////////////////////////////////////////////////////////////////
window.electronAPI.handleComPorts((event, port) => {
  // Create a new option element
  const option = document.createElement('option');
  option.value = port.path;
  option.textContent = (`${port.path}, ${port.friendlyName}`); 
  // Append the new option to the end of dropdown list
  comPortDropDownList.appendChild(option);
});

// connectButton ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var isConnected = false; // Initially not connected
connectButton.addEventListener('click', () => {
  if (!isConnected) {
    // Perform connect actions
    isConnected = true;
    connectButton.innerHTML = "DISCONN";
    window.electronAPI.setConnectButton(1)
  } else {
    // Perform disconnect actions
    isConnected = false;
    connectButton.innerHTML = "CONNECT"; 
    window.electronAPI.setConnectButton(0)
  }
})

// readParameters button //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
readParameters.addEventListener('click', () => {
  window.electronAPI.readGCSParameters('GCSParameters')
})

// writeParameters button //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
writeParameters.addEventListener('click', () => {
  window.electronAPI.writeGCSParameters(
    loiterZVelUpMax.value, loiterZVelDownMax.value, loiterXYVel.value, landSpeed.value, takeoffHeight.value, loiterYawSpeed.value, RTLAltitude.value, waypointNavYawSpeed.value, waypointNavSpeedMax.value, weightOffset.value, altitudeMax.value, distanceMax.value,
    RollP.value, PitchP.value, YawP.value, RollI.value, PitchI.value, YawI.value, RollD.value, PitchD.value, YawD.value, RollrD.value, PitchrD.value, YawrD.value, RollImax.value, PitchImax.value, YawImax.value,
    XP.value, YP.value, ZP.value, XI.value, YI.value, ZI.value, XD.value, YD.value, ZD.value, XrD.value, YrD.value, ZrD.value, XPerrmax.value, YPerrmax.value, ZPerrmax.value, XIerrmax.value, YIerrmax.value, ZIerrmax.value, XDerrmax.value, YDerrmax.value, ZDerrmax.value, XAerrmax.value, YAerrmax.value, ZAerrmax.value
  )
  console.log("Up Max Value:", loiterZVelUpMax.value);
  console.log("Down Max Value:", loiterZVelDownMax.value);
})

// loadDefault button /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
loadDefault.addEventListener('click', () => {
  loiterZVelUpMax.value = loiterZVelUpMaxDefault
  loiterZVelDownMax.value = loiterZVelDownMaxDefault
  loiterXYVel.value = loiterXYVelDefault
  landSpeed.value = landSpeedDefault
  takeoffHeight.value = takeoffHeightDefault
  loiterYawSpeed.value = loiterYawSpeedDefault
  RTLAltitude.value = RTLAltitudeDefault
  waypointNavYawSpeed.value = waypointNavYawSpeedDefault
  waypointNavSpeedMax.value = waypointNavSpeedMaxDefault
  weightOffset.value = weightOffsetDefault
  altitudeMax.value = altitudeMaxDefault
  distanceMax.value = distanceMaxDefault
  
  RollP.value = RollPDefault
  PitchP.value = PitchPDefault
  YawP.value = YawPDefault
  RollI.value = RollIDefault
  PitchI.value = PitchIDefault
  YawI.value = YawIDefault
  RollD.value = RollDDefault
  PitchD.value = PitchDDefault
  YawD.value = YawDDefault
  RollrD.value = RollrDDefault
  PitchrD.value = PitchrDDefault
  YawrD.value = YawrDDefault
  RollImax.value = RollImaxDefault
  PitchImax.value = PitchImaxDefault
  YawImax.value = YawImaxDefault
  
  XP.value = XPDefault
  YP.value = YPDefault
  ZP.value = ZPDefault
  XI.value = XIDefault
  YI.value = YIDefault
  ZI.value = ZIDefault
  XD.value = XDDefault
  YD.value = YDDefault
  ZD.value = ZDDefault
  XrD.value = XrDDefault
  YrD.value = YrDDefault
  ZrD.value = ZrDDefault
  XPerrmax.value = XPerrmaxDefault
  YPerrmax.value = YPerrmaxDefault
  ZPerrmax.value = ZPerrmaxDefault
  XIerrmax.value = XIerrmaxDefault
  YIerrmax.value = YIerrmaxDefault
  ZIerrmax.value = ZIerrmaxDefault
  XDerrmax.value = XDerrmaxDefault
  YDerrmax.value = YDerrmaxDefault
  ZDerrmax.value = ZDerrmaxDefault
  XAerrmax.value = XAerrmaxDefault
  YAerrmax.value = YAerrmaxDefault
  ZAerrmax.value = ZAerrmaxDefault
})

// saveDefault button ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
saveDefault.addEventListener('click', () => {
  loiterZVelUpMaxDefault = loiterZVelUpMax.value 
  loiterZVelDownMaxDefault = loiterZVelDownMax.value
  loiterXYVelDefault = loiterXYVel.value
  landSpeedDefault = landSpeed.value
  takeoffHeightDefault = takeoffHeight.value
  loiterYawSpeedDefault = loiterYawSpeed.value
  RTLAltitudeDefault = RTLAltitude.value
  waypointNavYawSpeedDefault = waypointNavYawSpeed.value
  waypointNavSpeedMaxDefault = waypointNavSpeedMax.value
  weightOffsetDefault = weightOffset.value
  altitudeMaxDefault = altitudeMax.value
  distanceMaxDefault = distanceMax.value
  
  RollPDefault = RollP.value
  PitchPDefault = PitchP.value
  YawPDefault = YawP.value
  RollIDefault = RollI.value 
  PitchIDefault = PitchI.value 
  YawIDefault = YawI.value 
  RollDDefault = RollD.value 
  PitchDDefault = PitchD.value 
  YawDDefault = YawD.value
  RollrDDefault = RollrD.value
  PitchrDDefault = PitchrD.value 
  YawrDDefault = YawrD.value 
  RollImaxDefault = RollImax.value 
  PitchImaxDefault = PitchImax.value 
  YawImaxDefault = YawImax.value 

  XPDefault = XP.value
  YPDefault = YP.value
  ZPDefault = ZP.value
  XIDefault = XI.value
  YIDefault = YI.value
  ZIDefault = ZI.value
  XDDefault = XD.value
  YDDefault = YD.value
  ZDDefault = ZD.value
  XrDDefault = XrD.value
  YrDDefault = YrD.value
  ZrDDefault = ZrD.value
  XPerrmaxDefault = XPerrmax.value
  YPerrmaxDefault = YPerrmax.value
  ZPerrmaxDefault = ZPerrmax.value
  XIerrmaxDefault = XIerrmax.value
  YIerrmaxDefault = YIerrmax.value
  ZIerrmaxDefault = ZIerrmax.value
  XDerrmaxDefault = XDerrmax.value
  YDerrmaxDefault = YDerrmax.value
  ZDerrmaxDefault = ZDerrmax.value
  XAerrmaxDefault = XAerrmax.value
  YAerrmaxDefault = YAerrmax.value
  ZAerrmaxDefault = ZAerrmax.value
})


// Update index.html with the new messages ///////////////////////////////////////////////////////////////////////////////////////////////////////
window.electronAPI.handleAttitude((event, data) => {
  yaw.innerText = data.yaw*180/Math.PI
  roll.innerText = data.roll*180/Math.PI
  pitch.innerText = data.pitch*180/Math.PI
})

window.electronAPI.handleAirspeedAutocal((event, data) => {
  if (data.vx == 1){
    loiterZVelUpMax.value = data.vy.toFixed(2);
    loiterZVelDownMax.value = data.vz.toFixed(2);
    loiterXYVel.value = data.diffPressure.toFixed(2);
    landSpeed.value = data.EAS2TAS.toFixed(2);
    takeoffHeight.value = data.ratio.toFixed(2);
    loiterYawSpeed.value = data.stateX.toFixed(2);
    RTLAltitude.value = data.stateY.toFixed(2);
    waypointNavYawSpeed.value = data.stateZ.toFixed(2);
    waypointNavSpeedMax.value = data.Pax.toFixed(2);
    weightOffset.value = data.Pax.toFixed(2);
    altitudeMax.value = data.Pby.toFixed(2);
    distanceMax.value = data.Pcz.toFixed(2);

  } else if (data.vx == 2){
    srpP.value = data.vy.toFixed(2);
    srpI.value = data.vz.toFixed(2);
    srpImax.value = data.diffPressure.toFixed(2);
    rrpP.value = data.EAS2TAS.toFixed(2);
    rrpD.value = data.ratio.toFixed(2);
    syP.value = data.stateX.toFixed(2);
    syI.value = data.stateY.toFixed(2);
    syImax.value = data.stateZ.toFixed(2);
    ryP.value = data.Pax.toFixed(2);
    ryD.value = data.Pby.toFixed(2);
  
  } else if (data.vx == 3){
    sXYP.value = data.vy.toFixed(2);
    rXYP.value = data.vz.toFixed(2);
    rXYI.value = data.diffPressure.toFixed(2);
    rXYImax.value = data.EAS2TAS.toFixed(2);
    sZP.value = data.ratio.toFixed(2);
    rZP.value = data.stateX.toFixed(2);
    aZP.value = data.stateY.toFixed(2);
    aZI.value = data.stateZ.toFixed(2);
    aZImax.value = data.Pax.toFixed(2);
  }
  // console.log('Event received:', event);
  // console.log('New value:', value);  
})

// Update main.js when there is a change in comPort, baudRate, udpPort //////////////////////////////////////////////////////////////////////////////////
comPortDropDownList.addEventListener('change', function(event) {
  const comPort = event.target.value;
  window.electronAPI.setComPort(comPort)
  console.log(`Selected value: ${comPort}`);
});

baudRateDropDownList.addEventListener('change', function(event) {
  const baudRate = event.target.value;
  window.electronAPI.setBaudRate(baudRate)
  console.log(`Selected value: ${baudRate}`);
});

udpPortInput.addEventListener('change', function(event) {
  const udpPort = event.target.value;
  window.electronAPI.setUDPPort(udpPort)
  console.log(`Selected value: ${udpPort}`);
});






// To increment and decrement 'configuration parameter values' from mouse scroll //////////////////////////////////////////////////////////////////////////
function handleWheelEvent(event, inputElement) {
  event.preventDefault();

  const currentValue = parseFloat(inputElement.value);
  const step = parseFloat(inputElement.step);
  const delta = -Math.sign(event.deltaY); // Reversed direction

  const newValue = currentValue + step * delta;
  const minValue = 0;

  if (newValue >= minValue) {
    inputElement.value = newValue.toFixed(2);
  } else {
    inputElement.value = minValue.toFixed(2);
  }
}

loiterZVelUpMax.addEventListener('wheel', (event) => {
  handleWheelEvent(event, loiterZVelUpMax);
});

loiterZVelDownMax.addEventListener('wheel', (event) => {
  handleWheelEvent(event, loiterZVelDownMax);
});

loiterXYVel.addEventListener('wheel', (event) => {
  handleWheelEvent(event, loiterXYVel);
});

landSpeed.addEventListener('wheel', (event) => {
  handleWheelEvent(event, landSpeed);
});

takeoffHeight.addEventListener('wheel', (event) => {
  handleWheelEvent(event, takeoffHeight);
});

loiterYawSpeed.addEventListener('wheel', (event) => {
  handleWheelEvent(event, loiterYawSpeed);
});

RTLAltitude.addEventListener('wheel', (event) => {
  handleWheelEvent(event, RTLAltitude);
});

waypointNavYawSpeed.addEventListener('wheel', (event) => {
  handleWheelEvent(event, waypointNavYawSpeed);
});

waypointNavSpeedMax.addEventListener('wheel', (event) => {
  handleWheelEvent(event, waypointNavSpeedMax);
});

altitudeMax.addEventListener('wheel', (event) => {
  handleWheelEvent(event, altitudeMax);
});

distanceMax.addEventListener('wheel', (event) => {
  handleWheelEvent(event, distanceMax);
});

// /*-------------------------------------------------------------------------------------*/ 
// srpP.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, srpP);
// });

// srpI.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, srpI);
// });

// srpImax.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, srpImax);
// });

// rrpP.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, rrpP);
// });

// rrpD.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, rrpD);
// });

// syP.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, syP);
// });

// syI.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, syI);
// });

// syImax.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, syImax);
// });

// ryP.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, ryP);
// });

// ryD.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, ryD);
// });

// /*-------------------------------------------------------------------------------------*/ 
// sXYP.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, sXYP);
// });

// rXYP.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, rXYP);
// });

// rXYI.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, rXYI);
// });

// rXYImax.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, rXYImax);
// });

// sZP.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, sZP);
// });

// rZP.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, rZP);
// });

// aZP.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, aZP);
// });

// aZI.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, aZI);
// });

// aZImax.addEventListener('wheel', (event) => {
//   handleWheelEvent(event, aZImax);
// });

