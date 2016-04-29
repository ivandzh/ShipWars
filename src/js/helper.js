var Helper = {

    //helper functions accessible from everywhere

    getScreenWidth : function () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    },

    getScreenHeight : function () {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    },

    getShooter : function (playerId) {
        window.shooter = playerId;
        console.log("Shooter ID = " + window.shooter);
    }
};

module.exports = Helper;