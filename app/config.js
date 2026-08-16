const APP_CONFIG = Object.freeze({
    developmentMode: false
});

function isDevelopmentMode(){
    return APP_CONFIG.developmentMode === true;
}
