const emailConfig = {
    development: {
        from: 'onboarding@resend.dev',
        to: 'delivered@resend.dev',
    },
    production: {
        from: `No-reply <${process.env.SERVER_MAIL}>`,
        to: process.env.ADMIN_MAIL || 'thobena.yann@orange.fr',
    },
};

export default emailConfig;
