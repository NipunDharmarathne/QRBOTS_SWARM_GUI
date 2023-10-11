const { app, BrowserWindow, ipcMain } = require('electron')
const { SerialPort } = require('serialport')
const { MavEsp8266 } = require('node-mavlink')
const { minimal, common, ardupilotmega, waitFor, send } = require('node-mavlink')
const { MavLinkPacketSplitter, MavLinkPacketParser } = require('node-mavlink');
const path = require('path')

const REGISTRY = {
  ...minimal.REGISTRY,
  ...common.REGISTRY,
  ...ardupilotmega.REGISTRY,
};

let mainWindow;   // Declare mainWindow in a broader scope
let serialConnection = null;  // Declare serial port instance in a broader scope
let udpConnection = null;

let comPortMain = "UDP";
let baudRateMain = 57600;
let udpPortMain = 14550;

// Create window function //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.maximize()
  mainWindow.loadFile('index.html')
  
  // Once the window is ready, call the functions
  mainWindow.webContents.on('dom-ready', () => {
    getAvailableCOMPorts()
    update_comPort_baudRate_udpPort()
    startCommunication()
  });
}


// Get available com ports //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getAvailableCOMPorts() {
  SerialPort.list().then(ports => {
    console.log('Available COM ports:');
    ports.forEach(port => {
      mainWindow.webContents.send('update-comports', port)
      console.log(port.path, port.friendlyName);
    });
  });
}


// Update comPort, baudRate, udpPort when there is a change in html file ////////////////////////////////////////////////////////////////////////////
function update_comPort_baudRate_udpPort() {
  ipcMain.on('set-comPort', (event, comPort) => {
    comPortMain = comPort
    console.log(comPortMain)
  }) 
  ipcMain.on('set-baudRate', (event, baudRate) => {
    baudRateMain = baudRate
    console.log(baudRateMain)
  }) 
  ipcMain.on('set-UDPPort', (event, udpPort) => {
    udpPortMain = udpPort
    console.log(udpPortMain)
  }) 
}


// Set communication mode(Serial/UDP) and start communication ///////////////////////////////////////////////////////////////////////////////////////
function startCommunication() {
  ipcMain.on('set-connectButton', (event, connect) => {
    if (comPortMain === "UDP") {
      if (connect == 1) {
        udp()
      } else if (connect == 0) {
        console.log("udp disconn")
        udpConnection.close()
      }

    } else {
      if (connect == 1) {
        serial(comPortMain, parseInt(baudRateMain));
        console.log(comPortMain, baudRateMain)
      } else if (connect == 0) {
          serialConnection.close();
          serialConnection = null;
          console.log("Disconnected from COM Port");
      }
    }
  })
}


// Serial Communication ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
async function serial(comPort, baudRate) {
  // Create an output stream to write data to the controller
  serialConnection = new SerialPort({
    path: comPort,
    baudRate: baudRate,
  });

  // Create the reader as usual by piping the source stream through the splitter and packet parser
  const reader = serialConnection.pipe(new MavLinkPacketSplitter()).pipe(new MavLinkPacketParser())

  // A flag that determines if the remote system is alive
  let online = false

  // React to packet being retrieved.
  // This is the place where all your application-level logic will exist
  reader.on('data', (packet) => {
    // Output generic debug information about this packet
    console.log(packet.debug())
    online = true

    const clazz = REGISTRY[packet.header.msgid];
    if (clazz && clazz.name === 'Attitude') { // Check if the packet is of type Attitude
      const data = packet.protocol.data(packet.payload, clazz);
      //console.log('Yaw:', data.yaw, 'Roll:', data.roll, 'Pitch:', data.pitch);
      mainWindow.webContents.send('update-attitude', data)
    }

    if (clazz && clazz.name === 'AirspeedAutocal') { 
      const data = packet.protocol.data(packet.payload, clazz);
      //console.log('vx:', data.vx, 'vy:', data.vy, 'vz:', data.vz);
      mainWindow.webContents.send('update-airspeedAutocal', data)
    }
  })

  // Wait for the remote system to be available
  await waitFor(() => online)


  ipcMain.on('read-GCSParameters', (event, arg) => {
    const message = new common.ParamRequestList()
    send(serialConnection, message)
  }) 


  ipcMain.on('write-GCSParameters', (event, 
    loiterZVelUpMax, loiterZVelDownMax, loiterXYVel, landSpeed, takeoffHeight, loiterYawSpeed, RTLAltitude, waypointNavYawSpeed, waypointNavYawMax, altitudeMax, distanceMax,
    srpP, srpI, srpImax, rrpP, rrpD, syP, syI, syImax, ryP, ryD,
    sXYP, rXYP, rXYI, rXYImax, sZP, rZP, aZP, aZI, aZImax) => {
    
    const m1 = new ardupilotmega.AirspeedAutocal()
      m1.vx = 1
      m1.vy = loiterZVelUpMax
      m1.vz = loiterZVelDownMax
      m1.diffPressure = loiterXYVel
      m1.EAS2TAS = landSpeed
      m1.ratio = takeoffHeight
      m1.stateX = loiterYawSpeed
      m1.stateY = RTLAltitude
      m1.stateZ = waypointNavYawSpeed
      m1.Pax = waypointNavYawMax
      m1.Pby = altitudeMax
      m1.Pcz = distanceMax
    send(serialConnection, m1)
  })
}


// UDP Communication /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
async function udp() {
  udpConnection = new MavEsp8266()
  await udpConnection.start(14550, 14550)

  // log incoming packets
  udpConnection.on('data', packet => {
    console.log(packet.debug())
    //console.log(packet)
    //console.log(packet.payload)
    //console.log(packet.header.sysid)

    const clazz = REGISTRY[packet.header.msgid];
    if (clazz && clazz.name === 'Attitude') { // Check if the packet is of type Attitude
      const data = packet.protocol.data(packet.payload, clazz);
      //console.log('Yaw:', data.yaw, 'Roll:', data.roll, 'Pitch:', data.pitch);
      mainWindow.webContents.send('update-attitude', data)

      ///////////////////////////////////////////////////////////////////////
      //Drone swarm
      if (packet.header.sysid == 1){
        mainWindow.webContents.send('update-attitude1', data)
      } else if (packet.header.sysid == 2){
        mainWindow.webContents.send('update-attitude2', data)
      }
      ///////////////////////////////////////////////////////////////////////
    }

    if (clazz && clazz.name === 'AirspeedAutocal') { 
      const data = packet.protocol.data(packet.payload, clazz);
      //console.log('vx:', data.vx, 'vy:', data.vy, 'vz:', data.vz);
      mainWindow.webContents.send('update-airspeedAutocal', data)
    }
  })

  ipcMain.on('read-GCSParameters', (event, arg) => {
    const message = new common.ParamRequestList()
      message.targetSystem = 1
      message.targetComponent = 1
    udpConnection.send(message)
  }) 

  ipcMain.on('write-GCSParameters', (event, 
    loiterZVelUpMax, loiterZVelDownMax, loiterXYVel, landSpeed, takeoffHeight, loiterYawSpeed, RTLAltitude, waypointNavYawSpeed, waypointNavYawMax, altitudeMax, distanceMax,
    srpP, srpI, srpImax, rrpP, rrpD, syP, syI, syImax, ryP, ryD,
    sXYP, rXYP, rXYI, rXYImax, sZP, rZP, aZP, aZI, aZImax) => {
    
    const m1 = new ardupilotmega.AirspeedAutocal()
      m1.vx = 1
      m1.vy = loiterZVelUpMax
      m1.vz = loiterZVelDownMax
      m1.diffPressure = loiterXYVel
      m1.EAS2TAS = landSpeed
      m1.ratio = takeoffHeight
      m1.stateX = loiterYawSpeed
      m1.stateY = RTLAltitude
      m1.stateZ = waypointNavYawSpeed
      m1.Pax = waypointNavYawMax
      m1.Pby = altitudeMax
      m1.Pcz = distanceMax
    udpConnection.send(m1)
  })

}

// Electron default functions /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////