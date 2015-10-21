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

var download = function(data){
    var xmlHttpRequest = new XMLHttpRequest();
    var self = this;
    xmlHttpRequest.onreadystatechange = function()
    {
        var READYSTATE_COMPLETED = 4;
        var HTTP_STATUS_OK = 200;
    
        if( this.readyState == READYSTATE_COMPLETED
         && this.status == HTTP_STATUS_OK )
        {
            document.getElementById('loading').style.display="none";
            var response = JSON.parse(this.responseText)
            console.log(response)
            if(response['status']){

                console.log(response)
                for(key in Downloader.config.paths){
                    var content = response['urls'][key];
                    var links = document.getElementById('links');
                    var a = document.createElement('a');
                    a.innerHTML = "Download(" + key + ")"
                    a.download = Downloader.config.paths[key];
                    a.href = content;
                    links.appendChild(a);
                    links.appendChild(document.createElement('br'));
                }
            }else{
                var error = document.getElementById('error');
                var textNode = document.createTextNode(response['msg']);
                error.appendChild(textNode);
            }
        }
    }
    xmlHttpRequest.open( 'POST', Downloader.config.endpoint );
    xmlHttpRequest.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded;application/json' );
    xmlHttpRequest.send(JSON.stringify(data));
}


window.addEventListener('load', function(){
    var loading = document.getElementById('loading');
    loading.style.display="none";
    // set k=
    var keyInput = document.getElementById('key_input');
    if(Query.k != null){
        keyInput.value = Query.k
    }
    var downloadButton = document.getElementById('download_button');
    downloadButton.onclick = function(){
        // remove previous error message
        var error = document.getElementById('error');
        for (var i = error.childNodes.length-1; i>=0; i--) {
            error.removeChild(error.childNodes[i]);
        }
        // remove previous download url
        var links = document.getElementById('links');
        for (var i = links.childNodes.length-1; i>=0; i--) {
            links.removeChild(links.childNodes[i]);
        }
        // set download function
        var keyInput = document.getElementById('key_input');
        Downloader.config.key = keyInput.value;
        download(Downloader.config);
        // loading gif
        loading.style.display="";
    }
}, false);
