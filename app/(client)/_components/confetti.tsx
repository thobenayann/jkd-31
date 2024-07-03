'use client';

import { ConfettiButton } from '@/components/ui/confetti';

function Confetti() {
    return (
        // bg-transparent hover:bg-transparent
        <ConfettiButton className='h-[700px] w-40 bg-transparent hover:bg-transparent max-md:hidden'>
            TEST
        </ConfettiButton>
    );
}

export default Confetti;
