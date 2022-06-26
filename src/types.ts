export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	UserController: Symbol.for('UserController'),
	UsersService: Symbol.for('UsersService'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	UsersRepository: Symbol.for('UsersRepository'),
};

export const ENV_TYPE: EnvType = {
	SALT: 'SALT',
	SECRET_JWT_TOKEN: 'SECRET_JWT_TOKEN',
} as const;

type EnvType = {
	SALT: 'SALT';
	SECRET_JWT_TOKEN: 'SECRET_JWT_TOKEN';
};
