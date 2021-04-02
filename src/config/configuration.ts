import { Logger } from "@nestjs/common";

export enum Environment {
    PRODUCTION = "production",
    STAGING = "staging",
    DEVELOPMENT = "development",
}

const logger = new Logger("Configuration");

export const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        logger.warn(`${key} not found`);
    }
    return value;
};

export interface AWSConfiguration {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}

export interface Configuration {
    env: Environment;
    server: {
        port: number,
        address: string,
    };
    database: {
        host: string,
        port: number,
        username?: string,
        password?: string,
        name: string,
    };
    jwt: {
        secret: string,
        exp: number,
    };
    aws?: AWSConfiguration;
}

export default (): Configuration => {
    // Environment
    const env = getEnv("NODE_ENV") as Environment;

    // Server
    const serverPort = parseInt(getEnv("SERVER_PORT"), 10) || 3000;
    const serverAddress = getEnv("SERVER_ADDRESS") || `http://localhost:${serverPort}`;

    // Database
    const databaseHost = encodeURI(getEnv("DB_HOST"));
    const databasePort = parseInt(getEnv("DB_PORT"), 10);
    const databaseUsername = getEnv("DB_USER");
    const databasePassword = getEnv("DB_PASSWORD");
    const databaseName = getEnv("DB_NAME");

    // JWT
    const jwtSecret = getEnv("JWT_SECRET");
    const jwtExp = getEnv("JWT_EXP");

    // AWS
    let aws: { region: string; accessKeyId: string; secretAccessKey: string; };
    const awsRegion = getEnv("AWS_REGION");
    const awsAccessKeyId = getEnv("AWS_ACCESS_KEY_ID");
    const awsSecretAccessKey = getEnv("AWS_SECRET_ACCESS_KEY");
    if (awsRegion && awsAccessKeyId && awsSecretAccessKey) {
        aws = {
            region: awsRegion,
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey,
        };
    }

    return {
        env,
        server: {
            port: serverPort,
            address: serverAddress,
        },
        database: {
            host: databaseHost,
            port: databasePort,
            username: databaseUsername,
            password: databasePassword,
            name: databaseName,
        },
        jwt: {
            secret: jwtSecret,
            exp: jwtExp && parseInt(jwtExp, 10),
        },
        aws,
    };
};