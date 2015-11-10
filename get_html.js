var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var arrayCSV = [
  ['File Permission', 'Absolute Url', 'File Type']
];

function getData(callback){
  request(process.argv[2], function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var arr = doStufftoBody(body);
      callback(null, arr);
    }
  });
}

function doStufftoBody(body){
  var body = cheerio.load(body);

  body('tr').each(function(i, row){
    var tds = body(row).children('td');
    var file = body(tds.get(2)).text();
    var fileType = file.split('.')[1];
    if(fileType){
      var permissions = body(tds).first().text();
      var fileUrl = 'http://substack.net/' + body(tds.get(2)).children('a').attr('href');
      var rowArr = [permissions, fileUrl, fileType];
      arrayCSV.push(rowArr);   
    }
  });
  return arrayCSV;
}

function csvCreater(err, arr, callback){
  if(err){
    console.log(err);
  }
  var file = fs.createWriteStream('images.csv');
  var csvContent = '';
  arr.forEach(function(csvRow, index){
    dataString = csvRow.join(',');
    csvContent += index < arr.length ? dataString+ '\n' : dataString;
  });
  file.write(csvContent);
  callback();
}

getData(function (err,arr){
  csvCreater(err, arr, function(){
    console.log('Your File Has Been Written :)');
  });
});
