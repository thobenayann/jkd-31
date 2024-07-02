export const metadata = {
    title: 'Sanity studio - JKD 31',
    description: 'Espace de création de contenu pour le site Ji Dao 31',
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
