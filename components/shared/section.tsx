'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface SectionProps {
    children: React.ReactNode;
}

export default function Section({ children }: SectionProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-opacity-75 p-2 md:p-8 rounded-lg shadow-md'
        >
            {children}
        </motion.section>
    );
}
