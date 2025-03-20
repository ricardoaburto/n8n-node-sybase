"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sybase = void 0;
class Sybase {
    constructor() {
        this.name = 'sybaseCredentialsApi';
        this.displayName = 'Sybase Credentials';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                default: 5000,
            },
            {
                displayName: 'Database',
                name: 'database',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
            },
        ];
    }
}
exports.Sybase = Sybase;
