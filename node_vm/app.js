const express = require('express');
const request = require('request');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const maria=require('./database/connect/maria');
maria.connect();

const app = express();

app.set('view engine', 'ejs'); 
app.engine('html',require('ejs').renderFile);
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname+'/views/css/'));

const secretPath = path.join(__dirname,'secret.json');

function readSecretFile() {
  try {
      const secretData = fs.readFileSync(secretPath, 'utf8');
      return JSON.parse(secretData);
  } catch (error) {
      return null;
  }
}

const secrets = readSecretFile();

app.get('/', (req, res) => {
  res.render(__dirname+'/views/translate.ejs');
});

app.post('/results', (req, res) => {
  const searchData = req.body.search;
  const lan_input=req.body.input;
  const lan_output=req.body.output;


  var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  var options = {
      url: api_url,
      form: {'source':lan_input, 'target':lan_output, 'text':searchData},
      headers: {'X-Naver-Client-Id':secrets.client_id, 'X-Naver-Client-Secret': secrets.client_secret}
  };
   request.post(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
      const parsedData = JSON.parse(body);
      const resultData = parsedData.message.result.translatedText;
      maria.insertData(searchData, resultData);
      maria.resetIndex();
      res.render(__dirname+'/views/result.ejs', { resultData }); 
    } else{
      res.status(500).send('내부 서버 오류');
    }
   });
});

app.get("/db/:cur", function (req, res) {
  maria.board_list(req.params.cur, function (error, result, result2) {
      if (error) {
        res.status(500).send('내부 서버 오류');
      }
      res.render(__dirname+'/views/board.ejs', { data: result, pasing: result2 });
  });
});

app.listen(80, function () {
  console.log('start');
});