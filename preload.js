const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  handleAttitude: (callback) => ipcRenderer.on('update-attitude', callback),
  handleAirspeedAutocal: (callback) => ipcRenderer.on('update-airspeedAutocal', callback),

  ////////////////////////////////////////////////////////////////////////////
  //Drone swarm
  handleAttitude1: (callback) => ipcRenderer.on('update-attitude1', callback),
  handleAttitude2: (callback) => ipcRenderer.on('update-attitude2', callback),
  ////////////////////////////////////////////////////////////////////////////

  handleComPorts: (callback) => ipcRenderer.on('update-comports', callback),

  setComPort: (comPort) => ipcRenderer.send('set-comPort', comPort),
  setBaudRate: (baudRate) => ipcRenderer.send('set-baudRate', baudRate),
  setUDPPort: (udpPort) => ipcRenderer.send('set-UDPPort', udpPort),
  setConnectButton: (connect) => ipcRenderer.send('set-connectButton', connect),

  readGCSParameters: (title) => ipcRenderer.send('read-GCSParameters', title),

  writeGCSParameters: 
  (loiterZVelUpMax, loiterZVelDownMax, loiterXYVel, landSpeed, takeoffHeight, loiterYawSpeed, RTLAltitude, waypointNavYawSpeed, waypointNavYawMax, weightOffset, altitudeMax, distanceMax,
  srpP, srpI, srpImax, rrpP, rrpD, syP, syI, syImax, ryP, ryD,
  sXYP, rXYP, rXYI, rXYImax, sZP, rZP, aZP, aZI, aZImax
  ) => ipcRenderer.send('write-GCSParameters', 
  loiterZVelUpMax, loiterZVelDownMax, loiterXYVel, landSpeed, takeoffHeight, loiterYawSpeed, RTLAltitude, waypointNavYawSpeed, waypointNavYawMax, weightOffset, altitudeMax, distanceMax,
  srpP, srpI, srpImax, rrpP, rrpD, syP, syI, syImax, ryP, ryD,
  sXYP, rXYP, rXYI, rXYImax, sZP, rZP, aZP, aZI, aZImax
  ),
})