const http = require("http");

let CTA_TRAIN_KEY = process.env.CTA_TRAIN_KEY;
let CTA_BUS_KEY = process.env.CTA_BUS_KEY;

const chicagoTrainUrl = `http://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=${CTA_TRAIN_KEY}&rt=blue&outputType=JSON`;

const laUrl = "http://api.metro.net/agencies/lametro/routes/10/vehicles/";

const chicagoBusUrl = `http://www.ctabustracker.com/bustime/api/v2/getvehicles?key=${CTA_BUS_KEY}&rt=4,9,20,22,34,49,53,55,60,62&format=json`;

const server = http.createServer((req, res) => {
  res.end("Test API service started");
});

server.listen(process.env.PORT || 3000);

// blue
// Ashland 9
// Madison 20
// Clark 22
// Pulaski 53

setInterval(() => {
  setTimeout(() => {
    getApiData(chicagoTrainUrl, formatTrainCoords);
  }, 6000);

  setTimeout(() => {
    getApiData(chicagoBusUrl, formatBusCoords);
  }, 0);

  setTimeout(() => {
    getApiData(laUrl, formatLaCoords);
  }, 12000);
}, 15000);

let formatLaCoords = data => {
  let lat = data.items[0].latitude;
  let lon = data.items[0].longitude;

  sendCoords(lat, lon, "ladowntown");
};

let formatTrainCoords = data => {
  let lat = data.ctatt.route[0].train[0].lat;
  let lon = data.ctatt.route[0].train[0].lon;

  sendCoords(lat, lon, "ctablue");

  let redLat = data.ctatt.route[1].train[0].lat;
  let redLon = data.ctatt.route[1].train[0].lon;

  setTimeout(() => {
    sendCoords(redLat, redLon, "ctared");
  }, 2000);
};
let formatBusCoords = data => {
  let parsedData = data["bustime-response"].vehicle;
  const routes = ["4", "9", "20", "22", "34", "49", "55", "60", "62", "53"];

  routes.forEach(route => {
    parsedData.some(bus => {
      let busDetail = {};

      if (bus.rt === route) {
        busDetail.lat = bus.lat;
        busDetail.lon = bus.lon;
        busDetail.id = `cta${route}`;

        setTimeout(() => {
          sendCoords(busDetail.lat, busDetail.lon, busDetail.id);
        }, (Math.floor(Math.random() * 10) + 1) * 1000);
      }
      return bus.rt === route;
    });
  });
};

let getApiData = (url, callback) => {
  http.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      apiData = JSON.parse(body);

      callback(apiData);
    });
  });
};

sendCoords = (lat, lon, deviceId) => {
  console.log(`Sending ${deviceId} coordinates...`);
  console.log(`lat: ${lat}`);
  console.log(`lon: ${lon}`);

  var options = {
    method: "POST",
    hostname: "intense-everglades-50142.herokuapp.com",
    path: `/api/coords/${deviceId}?lat=${lat}&lon=${lon}`,
    headers: {
      "cache-control": "no-cache",
      "Test-Token": "b31495ed-30c2-4594-ab33-b44efe7ba21f"
    }
  };

  let req = http.request(options, function(res) {
    let chunks = [];

    res.on("data", chunk => {
      chunks.push(chunk);
    });

    res.on("end", () => {
      let body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.end();
};
