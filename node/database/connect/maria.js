const maria= require('mysql2');
const fs = require('fs');
const path = require('path');

//const secretData = fs.readFileSync('/run/secrets/node_secret', 'utf8');
const secretData = fs.readFileSync('/var/secrets/secrets.json', 'utf8');
const secrets = JSON.parse(secretData);

const connection=maria.createConnection({
    host:secrets.host,
    port:secrets.port,
    user:secrets.user,
    password:secrets.password,
    database:secrets.database
});


function insertData(searchData, resultData) {
    const query = 'INSERT INTO ko_en (input, output) VALUES (?, ?)';
    connection.query(query, [searchData, resultData],function(err,rows,fields){
      if(!err){
      } else {
        console.log(err);
      }
     })

}

function resetIndex(){
    connection.query('SET @CNT = 0;');
    connection.query('UPDATE ko_en SET ko_en.index=@CNT:=@CNT+1;');
    connection.query('ALTER TABLE ko_en AUTO_INCREMENT=1;', function(err, rows, fields) {
      if (!err) {
          console.log('인덱스 업데이트가 완료되었습니다.');
      } else {
          console.log(err);
      }
  });
}

function connect(){
    connection.connect(function(err){
        if(!!err){
            console.log(err)
        }
        else{
            console.log('Connected')
        }
    })
}

function board_list(cur,callback){

    var page_size = 10;
    var page_list_size = 10;
    var no = "";
    var totalPageCount = 0;

    var queryString = 'SELECT count(*) AS cnt FROM ko_en';

    connection.query(queryString, function (error2, data) {
        if (error2) {
            console.log(error2);
            return
        }
        totalPageCount = data[0].cnt
        var curPage = parseInt(cur) || 1;
        if (totalPageCount < 0) {
            totalPageCount = 0
        }

        var totalPage = Math.ceil(totalPageCount / page_size);
        var totalSet = Math.ceil(totalPage / page_list_size);         
        var curSet = Math.ceil(curPage / page_list_size) 
        var startPage = ((curSet - 1) * 10) + 1
        var endPage = (startPage + page_list_size) - 1; 
        if (curPage < 0) {
            no = 0
        } else {
            no = (curPage - 1) * 10
        }
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };
        var queryString = 'select * from ko_en order by `index` asc limit ?,?';
        connection.query(queryString, [no, page_size], function (error, result) {
            if (error) {
                return callback(error, null, null);
            }
            callback(null, result, result2);
        });
    });
}

module.exports ={connect,insertData,resetIndex,board_list} 