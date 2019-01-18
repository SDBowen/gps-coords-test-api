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
    console.log(body);
  });
});

// fetch(url)
//   .then(function(data) {
//     console.log(data);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });
