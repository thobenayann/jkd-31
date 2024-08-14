export const metadata = {
    title: 'Sanity studio - JKD Self Defense 31',
    description:
        'Espace de création de contenu pour le site JKD Self Defense 31',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='fr'>
            <body>{children}</body>
        </html>
    );
}
