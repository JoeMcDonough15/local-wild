const dbConfig = {
    development: {
        // storage: config.dbFile,
        dialect: "sqlite",
        seederStorage: "sequelize",
        logQueryParameters: true,
        typeValidation: true,
    },
    production: {
        use_env_variable: "DATABASE_URL",
        dialect: "postgres",
        seederStorage: "sequelize",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        define: {
        //   schema,
        },
    },
};
export default dbConfig;
