import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SybaseApi implements ICredentialType {
  name = 'sybaseCredentialsApi';
  displayName = 'Sybase Credentials';
  properties: INodeProperties[] = [
    {
      displayName: 'Host',
      name: 'host',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Port',
      name: 'port',
      type: 'number',
      default: 5000,
      required: true,
    },
    {
      displayName: 'Database',
      name: 'database',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
  ];
}