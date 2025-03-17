export const environment = {
    auth: {
        disabled: process.env.DISABLE_AUTH_MIDDLEWARE === "true"
    },
    dataBaseUrl: process.env.DATABASE_URL,
}
