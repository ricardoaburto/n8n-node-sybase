import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeApiError,
} from 'n8n-workflow';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

interface _SybaseCredentials {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

interface SybaseNodeParameters {
  operation: 'executeQuery' | 'getTableDefinition' | 'getSchemaAndTablesList';
  query: string;
  tableName: string;
  schemaName: string;
}

interface QueryResult {
  [key: string]: string | number | boolean | null | undefined | QueryResult | QueryResult[];
}

function transformToQueryResult(data: unknown): QueryResult {
  if (data === null || data === undefined) {
    return { value: null };
  }
  if (typeof data === 'string') {
    return { value: data };
  }
  if (typeof data === 'number' || typeof data === 'boolean') {
    return { value: data };
  }
  if (Array.isArray(data)) {
    return { items: data.map(transformToQueryResult) };
  }
  if (typeof data === 'object') {
    const result: QueryResult = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = transformToQueryResult(value);
    }
    return result;
  }
  // Corrección para la línea 54: Convertir explícitamente todos los casos a string
  if (typeof data === 'function') {
    return { value: 'function' };
  }
  if (typeof data === 'symbol') {
    return { value: data.toString() }; // Ejemplo: "Symbol(foo)"
  }
  // Último caso: cualquier otro tipo desconocido (nunca debería llegar aquí, pero para completar el análisis)
  return { value: 'unknown' };
}

export class SybaseTool implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Sybase',
    name: 'sybaseTool',
    group: ['transform'],
    version: 1,
    description: 'Interactúa con una base de datos Sybase usando JTDS',
    defaults: { name: 'Sybase' },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    credentials: [{ name: 'sybaseCredentialsApi', required: true }],
    usableAsTool: true,
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Execute Query', value: 'executeQuery' },
          { name: 'Get Table Definition', value: 'getTableDefinition' },
          { name: 'Get Schema and Tables List', value: 'getSchemaAndTablesList' },
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
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const rawCredentials = await this.getCredentials('sybaseCredentialsApi');

    const credentials: _SybaseCredentials = {
      host: typeof rawCredentials.host === 'string' ? rawCredentials.host : '',
      port: typeof rawCredentials.port === 'number' ? rawCredentials.port : 5000,
      database: typeof rawCredentials.database === 'string' ? rawCredentials.database : '',
      username: typeof rawCredentials.username === 'string' ? rawCredentials.username : '',
      password: typeof rawCredentials.password === 'string' ? rawCredentials.password : '',
    };

    if (!credentials.host || !credentials.port || !credentials.database || !credentials.username || !credentials.password) {
      throw new NodeApiError(this.getNode(), { message: 'Credenciales incompletas o inválidas.' });
    }

    let parameters: SybaseNodeParameters = {
      operation: this.getNodeParameter('operation', 0, 'executeQuery') as 'executeQuery' | 'getTableDefinition' | 'getSchemaAndTablesList',
      query: this.getNodeParameter('query', 0, '') as string,
      tableName: this.getNodeParameter('tableName', 0, '') as string,
      schemaName: this.getNodeParameter('schemaName', 0, '') as string,
    };

    const inputData: Partial<SybaseNodeParameters> = items.length > 0 && items[0].json
      ? (items[0].json as Partial<SybaseNodeParameters>)
      : {};
    parameters = {
      operation: inputData.operation || parameters.operation,
      query: inputData.query || parameters.query,
      tableName: inputData.tableName || parameters.tableName,
      schemaName: inputData.schemaName || parameters.schemaName,
    };

    let sqlQuery: string;
    switch (parameters.operation) {
      case 'executeQuery':
        if (!parameters.query) {
          throw new NodeApiError(this.getNode(), { message: 'La consulta SQL no puede estar vacía.' });
        }
        sqlQuery = parameters.query;
        break;
      case 'getTableDefinition':
        if (!parameters.tableName || !parameters.schemaName) {
          throw new NodeApiError(this.getNode(), { message: 'Debes proporcionar tableName y schemaName.' });
        }
        sqlQuery = `SELECT c.name AS column_name, t.name AS data_type, c.length FROM syscolumns c JOIN systypes t ON c.usertype = t.usertype JOIN sysobjects o ON c.id = o.id WHERE o.name = '${parameters.tableName}' AND o.type = 'U'`;
        break;
      case 'getSchemaAndTablesList':
        sqlQuery = `SELECT u.name, o.name FROM sysobjects o JOIN sysusers u ON o.uid = u.uid WHERE o.type = 'U'`;
        break;
      default:
        sqlQuery = '';
        break;
    }

    const { host, port, database, username, password } = credentials;
    const command = `java -cp /app:/app/lib/jtds-1.3.1.jar:/app/lib/json.jar SybaseQuery "${host}" "${port}" "${database}" "${username}" "${password}" "${sqlQuery}"`;


    try {
      const { stdout } = await execPromise(command);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const rawResults: object = JSON.parse(stdout);
      const results: QueryResult[] = Array.isArray(rawResults)
        ? rawResults.map(transformToQueryResult)
        : [transformToQueryResult(rawResults)];
      return [results.map((row: QueryResult) => ({ json: row }))];
    } catch (error) {
      throw new NodeApiError(this.getNode(), { message: `Error ejecutando consulta: ${(error as Error).message}` });
    }
  }
}