const axios = require('axios')

module.exports = client => {
  /*
    PERMISSION LEVEL FUNCTION

    This is a very basic permissions system for commands which uses "levels"
    "spaces" are intentionally left blank so you can add them if you want.
    NEVER GIVE ANYONE BUT THE OWNER THE LEVEL 4! By default this can run any command
    including the VERY DANGEROUS `eval` and `exec` commands!
  */
    client.permLevel = (msg) => {
        let permlvl = 0
        const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1)
        while(permOrder.length) {
        const currentLevel = permOrder.shift()
        if(currentLevel.check(msg)) {
            permlvl = currentLevel.level
            break
        }
        }
        return permlvl
    }
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
    Array.prototype.randomize = function() {
        return this[Math.floor(Math.random() * this.length)]
    }
    Object.defineProperty(String.prototype, "toProperCase", {
        toProperCase: () => {this.charAt(0).toUpperCase() + this.slice(1);}
    })
    String.prototype.sayHi = function() {
        return 'Hi, My name is ' + this
    };

    String.prototype.truncate = function(n) {
        return (this.length > n) ? this.substr(0, n-3) + '...' : this;
    };

    String.prototype.isEmpty = function() {
        if (typeof this == 'undefined' || !this || this.length === 0 || this === "" || !/[^\s]/.test(this) || /^\s*$/.test(this) || this.replace(/\s/g,"") === "")
            return true;
        else
            return false;
    }

    String.prototype.isURL = function() {
        let urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        let url = new RegExp(urlRegex, 'i');
        return this.length < 2083 && url.test(this);
    }

    client.code = (lang, contents) => {
        return `${'```'}${lang}\n${contents}${'\n```'}`
    }
}
