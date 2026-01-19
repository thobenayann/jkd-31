export type EmailFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
};

export type EmailConfig = {
    from: string;
    to: string;
    cc?: string;
};

export type EmailEnvironment = 'development' | 'production';

export type EmailResult = {
    success: boolean;
    error?: string;
    messageId?: string;
};
