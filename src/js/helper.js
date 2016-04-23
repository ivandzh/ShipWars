var Helper = {
randomNumber: function(minimum, maximum) {
    return Math.round(Math.random() * (maximum - minimum) + minimum);
},

getScreenWidth : function () {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
},

getScreenHeight : function () {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}
};

module.exports = Helper;