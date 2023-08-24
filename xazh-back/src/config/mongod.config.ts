/**
 * MongoDB Configuration
 */

export default {
    user: 'xazh-dba',
    pswd: 'xazh',
    host: '192.168.22.22',
    port: '27017',
    db: 'XAZH',
    option: {
        authMechanism: 'DEFAULT',
        authSource: 'XAZH',
    },
    connOption: {
    },
    socket: function (db: string = null): string {
        var socket: string =
            `mongodb://${this.user}:${this.pswd}@${this.host}:${this.port}/${db ? db : this.db}?`
        for (const [key, value] of Object.entries(this.option))
            socket += `${key}=${value}&`

        return socket
    },
}