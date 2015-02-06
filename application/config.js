module.exports = {
    "baseuri": "",
    "port": 8080,
    "log": {
        "level": "debug",
        "file": "./log/application.log"
    }, 
    "events": {
        "logtofile": {
            "enabled": true,
            "directory": "/tmp/feedback/log"
        },
    },
    "server": {
        "name": "inventar",
        "version": ["1.0.0"],
        "throttle": {
            "rate": 10,
            "burst": 10,
            "ip": false,
            "xff": true
        }
    },
    "databases": {
        "primary": {
            "type": "primary",
            "url": "mongodb://localhost/inventar",
            "poolSize": 10
        }
    },
    "version": "test",
    "build": "0"
}