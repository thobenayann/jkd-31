export const obfuscateEmail = (email: string) => {
    return email
        .split('')
        .map((char) => `&#${char.charCodeAt(0)};`)
        .join('');
};
