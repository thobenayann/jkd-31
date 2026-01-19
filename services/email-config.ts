import type { EmailConfig, EmailEnvironment } from './email.types';

const getEnvironment = (): EmailEnvironment => {
    return process.env.VERCEL_ENV === 'production'
        ? 'production'
        : 'development';
};

const getEmailConfig = (environment: EmailEnvironment): EmailConfig => {
    const configs: Record<EmailEnvironment, EmailConfig> = {
        development: {
            from: 'Formulaire de contact jkd-selfdefense31.fr <no-reply@jkd-selfdefense31.fr>',
            to: process.env.DEV_TEST_EMAIL || 'test@test.dev',
            cc: process.env.DEV_TEST_EMAIL_CC,
        },
        production: {
            from: `Formulaire de contact jkd-selfdefense31.fr <${process.env.SERVER_MAIL}>`,
            to: process.env.ADMIN_MAIL || 'thobena.yann@orange.fr',
            cc: process.env.ADMIN_MAIL_CC,
        },
    };

    return configs[environment];
};

export const emailConfig = {
    getEnvironment,
    getConfig: getEmailConfig,
};
