/** Promise Responder
 * Created by jefferson.wu on 2/3/17.
 */

module.exports.getRandomPromiseData = function(delay) {

    return new Promise(function(resolve, reject){

        setTimeout(function(){
            if (Math.floor(Math.random() *2) == 0) {
                resolve({status: 'completed', payload:{message: 'You have data!'}});
            } else {
                reject({status: 'failed', payload: {message: 'Your request failed!'}});
            }
        }, delay);
    });
};