var request = require('request');
var fs = require('fs');

const secret = require('./secret');
const secretKey = secret.GITHUB_TOKEN;

var myArgs = process.argv.slice(2);

if (myArgs.length !== 2 || myArgs[0] !== 'jquery' || myArgs[1] !== 'jquery' ) {
  return console.log("Wrong number of arguments or wrong arguments!");
} else {
  getRepoContributors(myArgs[0], myArgs[1], dowloadAvatar);
}

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secretKey
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

function dowloadAvatar(err, result) {
  if(result) {
    var listAvatars = JSON.parse(result);
    listAvatars.forEach(element => {
      downloadImageByURL(element.avatar_url, element.login);
    });
  } else {
    console.log("Errors:", err);
  }
}

function downloadImageByURL(url, filePath) {
  request.get(url)              
       .on('error', function (err) {                                   
         throw err; 
       })
       .on('response', function (response) {                           
         console.log('Response Status Code: ', response.statusCode);
       })
       .pipe(fs.createWriteStream(`./avatars/${filePath}.jpg`));              
}



