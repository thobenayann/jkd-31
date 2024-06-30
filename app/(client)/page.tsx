export default function Home() {
    return (
        <div
            className='h-screen w-full'
            style={{
                backgroundImage: `url(/images/content/home/logo-jkd.webp)`,
                backgroundSize: 'cover',
            }}
        >
            <h1
                className={`text-6xl font-cinzel max-md:text-center md:pl-52 pt-60 md:pt-80`}
            >
                Ji Dao
            </h1>
        </div>
    );
}
