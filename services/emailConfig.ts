const emailConfig = {
    development: {
        from: 'Formulaire de contact jkd-selfdefense31.fr <no-reply@jkd-selfdefense31.fr>',
        to: 'contact@jkd-selfdefense31.fr',
    },
    production: {
        from: `Formulaire de contact jkd-selfdefense31.fr <${process.env.SERVER_MAIL}>`,
        to: process.env.ADMIN_MAIL || 'thobena.yann@orange.fr',
    },
};

export default emailConfig;
