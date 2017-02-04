/**
 * Created by jeffersonwu on 1/8/17.
 * Updated by jeffersonwu on 1/14.17.
 *
 * v0.2.0
 */

// ========================================
// DEBUG MODE MODULE ======================

var Debug = {
    debugModeOn: true,

    log: function(message, debugDiv){
        var timestamp = Date.now();
        if(Debug.debugModeOn === true) {
            console.log(message + ':: ' + timestamp);
        }

        if(debugDiv) {
            debugDiv.innerHTML = message + ' :: ' + timestamp;
        }
    }
};
// DEBUG MODE MODULE ======================
// ========================================
