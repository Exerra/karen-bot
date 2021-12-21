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

    client.code = (lang, contents) => {
        return `${'```'}${lang}\n${contents}${'\n```'}`
    }
}
