var Query = (function () {
    var queryString, queryItems, queryItem,
        i, length, matchs, key, pkey, skey, value, list, hash, params = {};
 
    // クエリストリングの取得
    queryString = window.location.search || '';
    queryString = queryString.substr(1, queryString.length);
 
    // パラメター毎に分解
    queryItems = queryString.split('&');
 
    // 各パラメターをキー&バリューに分解
    for (i = 0, length = queryItems.length; i < length; i++) {
        // 1組取り出し
        queryItem = (queryItems[i] || '').split('=');
 
        // キー&バリューに分解
        key = queryItem[0];
        value = queryItem[1] ? window.decodeURIComponent(queryItem[1]) : undefined;
 
        // キー文字列によってオブジェクトの作り方を変える
        matchs = (/([\w$]*)\[([\w$]*)\]/g).exec(key);
        if (matchs === null) {
            // 単純なキー&バリュー
            params[key] = value;
        } else {
            pkey = matchs[1];
            skey = matchs[2];
            if (!skey) {
                // 配列にバリューを格納
                list = params[pkey] = params[pkey] || [];
                list[list.length] = value;
            } else {
                // ハッシュにサブキーとバリューを格納
                hash = params[pkey] = params[pkey] || {};
                hash[skey] = value;
            }
        }
    }
    return params;
})();

var Downloader = {};
Downloader.config = {
  endpoint: "https://fcecb5bjij.execute-api.ap-northeast-1.amazonaws.com/test",
  key: "",
  content: "hoge",
  paths: [
      "test.zip",
      "hoge/fuga/piyo.txt"
      ],
  filename: "test.zip"
} 

Downloader.download = function(data){
    var xmlHttpRequest = new XMLHttpRequest();
    var self = this;
    xmlHttpRequest.onreadystatechange = function()
    {
        var READYSTATE_COMPLETED = 4;
        var HTTP_STATUS_OK = 200;
    
        if( this.readyState == READYSTATE_COMPLETED
         && this.status == HTTP_STATUS_OK )
        {
            content = JSON.parse(this.responseText)['urls'][Downloader.config.filename];
            var a = document.createElement('a');
            a.download = Downloader.config.filename;
            a.href = 'data:application/octet-stream,'+encodeURIComponent(content);
            a.click();
        }
    }
    xmlHttpRequest.open( 'POST', Downloader.config.endpoint );
    // サーバに対して解析方法を指定する
    xmlHttpRequest.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded;application/json' );
    // データをリクエスト ボディに含めて送信する
    xmlHttpRequest.send(JSON.stringify(data));
}


window.addEventListener('load', function(){
    var keyInput = document.getElementById('key_input');
    if(Query.k != null){
        keyInput.value = Query.k;
    }
    var downloadButton = document.getElementById('download_button');
    downloadButton.onclick = function(){
        var keyInput = document.getElementById('key_input');
        Downloader.config.key = keyInput.value;
        Downloader.download(Downloader.config);
    }
}, false);




