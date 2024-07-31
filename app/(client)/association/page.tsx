import AssoSection from './_components/asso-section';
import JkdSection from './_components/jkd-section';
import StafSection from './_components/staff-section';

export default function Association() {
    return (
        <main className='w-full max-md:pb-28'>
            <JkdSection />
            <AssoSection />
            <StafSection />
        </main>
    );
}
