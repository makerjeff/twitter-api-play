/**
 * Created by jeffersonwu on 1/23/17.
 */
function makeRequest(method, url, responseType) {
    return new Promise(function(resolve, reject){
        var req = new XMLHttpRequest();
        req.open(method, url, true);
        req.responseType = responseType;    //'blob', 'arraybuffer', 'text', 'document'

        // on load event.
        req.onload = function(e) {
            if(this.status == 200) {
                resolve(this.response);
            } else {
                reject({status: this.status, statusText: this.statusText});
            }
        };

        //on error event
        req.onerror = function(e) {
            reject({status: this.status, statusText: this.statusText});
        };

        //on progress event
        req.onprogress = function(e) {
            if( e.lengthComputable) {
                var percentComplete = e.loaded / e.total;
                Debug.log((percentComplete * 100).toFixed(2) + '%', resultDiv);
            } else {
                Debug.log('Unable to compute length of file. ', resultDiv);
            }
        };
        // send the request.
        req.send();
    });
}
