const querystring = require("querystring");
const https = require("https");

const public_key = "d37555ccc09141848543ab21e287b560";
const url = `https://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=${public_key}&rt=blue&outputType=JSON`;

https.get(url, res => {
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

    sendCoords(lat, lon);
  });
});

sendCoords = (lat, lon) => {
  var options = {
    method: "POST",
    hostname: "intense-everglades-50142.herokuapp.com",
    path: `/api/coords/480?lat=${lat}&lon=${lon}`,
    headers: {
      "cache-control": "no-cache",
      "Test-Token": "b31495ed-30c2-4594-ab33-b44efe7ba21f"
    }
  };

  var req = https.request(options, function(res) {
    var chunks = [];

    res.on("data", function(chunk) {
      chunks.push(chunk);
    });

    res.on("end", function() {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.end();
};
