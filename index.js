const https = require("https");

const public_key = "d37555ccc09141848543ab21e287b560";
const chicagoUrl = `https://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=${public_key}&rt=blue&outputType=JSON`;
const laUrl = "https://api.metro.net/agencies/lametro/routes/10/vehicles/";

const server = https.createServer((req, res) => {
  res.end("Test API service started");
});

server.listen(process.env.PORT || 3000);

setInterval(() => {
  setTimeout(() => {
    getCoords();
  }, 0);

  setTimeout(() => {
    getCoordsAgain();
  }, 12000);
}, 15000);

let getCoords = () => {
  https.get(chicagoUrl, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);

      trainOne = body.ctatt.route[0].train[0];

      let lat = trainOne.lat;
      let lon = trainOne.lon;

      console.log("Sending Chicago coordinates...");
      sendCoords(lat, lon, "ctablue");
    });
  });
};

let getCoordsAgain = () => {
  https.get(laUrl, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);

      bus = body.items[0];

      let lat = bus.latitude;
      let lon = bus.longitude;

      console.log("Sending LA coordinates...");
      sendCoords(lat, lon, "ladowntown");
    });
  });
};

sendCoords = (lat, lon, deviceId) => {
  var options = {
    method: "POST",
    hostname: "intense-everglades-50142.herokuapp.com",
    path: `/api/coords/${deviceId}?lat=${lat}&lon=${lon}`,
    headers: {
      "cache-control": "no-cache",
      "Test-Token": "b31495ed-30c2-4594-ab33-b44efe7ba21f"
    }
  };

  let req = https.request(options, function(res) {
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
