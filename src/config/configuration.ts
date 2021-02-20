export enum Environment {
    PRODUCTION = "production",
    STAGING = "staging",
    DEVELOPMENT = "development",
}

export interface Configuration {
    port: number;
    environment: Environment;
    database: {
        connectionUri: string,
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
        connectionUri: encodeURI(process.env.DB_CONNECTION_URI),
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        exp: parseInt(process.env.JWT_EXP, 10) || 86400,
    },
});