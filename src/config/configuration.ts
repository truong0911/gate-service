export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        connectionUri: process.env.DB_CONNECTION_URI,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        exp: parseInt(process.env.JWT_EXP, 10) || 86400,
    },
});