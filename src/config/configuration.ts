export enum Environment {
    PRODUCTION = "production",
    STAGING = "staging",
    DEVELOPMENT = "development",
}

export interface Configuration {
    port: number;
    environment: Environment;
    database: {
        host: string,
        port: number,
        user?: string,
        password?: string,
        dbName: string,
    };
    jwt: {
        secret: string,
        exp: number,
    };
}

export default (): Configuration => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV as Environment,
    database: {
        host: encodeURI(process.env.DB_HOST),
        port: parseInt(process.env.DB_PORT, 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        exp: parseInt(process.env.JWT_EXP, 10) || 86400,
    },
});