'use strict';

const { Driver } = require('homey');
const check = require('../../lib/WizConnect');
const konst = require('../../lib/constants');

let ipadr = "";

class SocketDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
  }

  async onPair(session) {
      var devices = [];

      session.setHandler("get_devices", async (data, callback) => {
          var CeD = new check();

          var devData = await CeD.connect(data.ipaddress, konst.LIGHT_SOCKET);
          if (devData != null) {
              var deviceDescriptor = {
                  "name": data.deviceName,
                  "data": {
                      "id": devData.id,
                      "ipadr": devData.ipadr,
                      "macadr": devData.macadr
                  },
                  "settings": {
                      "ip": devData.ipadr,
                      "mac": devData.macadr
                  },
                  "capabilities": ["onoff"]
              };
              devices.push(deviceDescriptor);
              session.emit("found", null);
          } else {
              session.emit("not_found", null);
          }
      });

      session.setHandler("list_devices", function (data, callback) {
          return devices;
      });
  }


  async onPairListDevices() {
    return [];
  }


}

module.exports = SocketDriver;
