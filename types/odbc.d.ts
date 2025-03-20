declare module 'odbc' {
    export function connect(connectionString: string): Promise<any>;
    export interface Connection {
      query(sql: string): Promise<any[]>;
      close(): Promise<void>;
    }
  }