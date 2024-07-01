import { sanityFetch } from '@/sanity/lib/fetch';
import { EVENTS_QUERY } from '@/sanity/lib/queries';
import { SanityDocument } from 'next-sanity';
import Link from 'next/link';

export default async function Posts() {
    const events = await sanityFetch<SanityDocument[]>({
        query: EVENTS_QUERY,
    });

    return (
        <main className='container mx-auto grid grid-cols-1 divide-y divide-blue-100 p-20'>
            {events?.length > 0 ? (
                events.map((event) => (
                    <Link key={event._id} href={event.slug.current}>
                        <h2 className='p-4 hover:bg-blue-50'>{event.title}</h2>
                    </Link>
                ))
            ) : (
                <div className='p-4 text-red-500'>No posts found</div>
            )}
        </main>
    );
}
