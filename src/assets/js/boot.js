window.onload = (event) => {
    console.log(
        !!(window.cordova || window.Cordova) ? 'Using Cordova' : 'Pure Angular'
    );
    window.addEventListener = document.addEventListener = function () {
        EventTarget.prototype.addEventListener.apply(this, arguments);
    };
    window.removeEventListener = document.removeEventListener = function () {
        EventTarget.prototype.removeEventListener.apply(this, arguments);
    };
}