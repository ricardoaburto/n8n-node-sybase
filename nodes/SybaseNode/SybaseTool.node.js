"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sybase = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
class Sybase {
    constructor() {
        this.description = {
            displayName: 'Sybase Tool',
            name: 'sybaseTool',
            group: ['transform'],
            version: 1,
            description: 'Interactúa con una base de datos Sybase usando JTDS',
            defaults: {
                name: 'Sybase Tool',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'sybaseCredentialsApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Execute Query', value: 'executeQuery' },
                        { name: 'Get Table Definition', value: 'getTableDefinition' },
                        { name: 'Get Schema and Tables List', value: 'getSchemaAndTablesList' }
                    ],
                    default: 'executeQuery',
                    required: true,
                    description: 'Selecciona la operación a realizar',
                },
                {
                    displayName: 'Query',
                    name: 'query',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { operation: ['executeQuery'] } },
                    description: 'Consulta SQL a ejecutar',
                },
                {
                    displayName: 'Table Name',
                    name: 'tableName',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { operation: ['getTableDefinition'] } },
                    description: 'Nombre de la tabla para obtener la definición',
                },
                {
                    displayName: 'Schema Name',
                    name: 'schemaName',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { operation: ['getTableDefinition'] } },
                    description: 'Nombre del esquema de la tabla',
                }
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const credentials = await this.getCredentials('sybaseCredentialsApi');
        let operation = String(this.getNodeParameter('operation', 0));
        let query = String(this.getNodeParameter('query', 0, ''));
        let tableName = String(this.getNodeParameter('tableName', 0, ''));
        let schemaName = String(this.getNodeParameter('schemaName', 0, ''));
        if (items.length > 0) {
            // Permitir que los parámetros vengan de AI Agent
            const inputData = items[0].json;
            operation = inputData.operation ?? operation;
            query = inputData.query ?? query;
            tableName = inputData.tableName ?? tableName;
            schemaName = inputData.schemaName ?? schemaName;
        }
        let sqlQuery;
        switch (operation) {
            case 'executeQuery':
                if (!query)
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'La consulta SQL no puede estar vacía.' });
                sqlQuery = query;
                break;
            case 'getTableDefinition':
                if (!tableName || !schemaName)
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'Debes proporcionar tableName y schemaName.' });
                sqlQuery = `SELECT c.name, t.name FROM syscolumns c JOIN systypes t ON c.usertype = t.usertype WHERE c.name = '${tableName}'`;
                break;
            case 'getSchemaAndTablesList':
                sqlQuery = `SELECT u.name, o.name FROM sysobjects o JOIN sysusers u ON o.uid = u.uid WHERE o.type = 'U'`;
                break;
            default:
                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: `Operación no soportada: ${operation}` });
        }
        const command = `java -cp /app/jtds-1.3.1.jar SybaseQuery "${credentials.host}" "${credentials.port}" "${credentials.database}" "${credentials.username}" "${credentials.password}" "${sqlQuery}"`;
        try {
            const { stdout } = await execPromise(command);
            const results = JSON.parse(stdout);
            return [results.map((row) => ({ json: row }))];
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: `Error ejecutando consulta: ${error.message}` });
        }
    }
}
exports.Sybase = Sybase;
