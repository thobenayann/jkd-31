'use client';

import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useMediaQuery } from '@/hooks/use-media-query';
import { simplifyTimeRange } from '@/lib/simplifyTimeRange';
import { Course } from '@/types/specific-types';
import { GraduationCap } from 'lucide-react';
import { useMemo, useState } from 'react';

interface CoursesTableProps {
    data: Course[];
}

export default function CoursesTable({ data }: CoursesTableProps) {
    const [filter, setFilter] = useState<string>('All');

    // Mémorisation des données filtrées
    const filteredData = useMemo(() => {
        if (filter === 'All') return data;
        return data;
    }, [data, filter]);

    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <FadeInWrapper className='w-full max-md:px-2 md:container' delay={0.2}>
            {/* Sélecteur de filtre */}
            <div className='py-4 flex max-md:justify-center'>
                <Select
                    onValueChange={(value) => setFilter(value)}
                    defaultValue='All'
                >
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Choisir un cours' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className='border-b-2 border-dashed flex items-center space-x-2'>
                                <span>Cours</span>
                                <GraduationCap color='#006599' />
                            </SelectLabel>
                            <SelectItem value='All'>Tous les cours</SelectItem>
                            <SelectItem value='jeet kune do'>
                                Jeet Kune Do
                            </SelectItem>
                            <SelectItem value='self-defense féminine'>
                                Self-Defense Féminine
                            </SelectItem>
                            <SelectItem value='jkd boxing'>
                                JKD Boxing
                            </SelectItem>
                            <SelectItem value='training physique'>
                                Training Physique
                            </SelectItem>
                            <SelectItem value='cours ado'>Cours Ado</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Première section : Situation */}
            <div className='shadow-lg shadow-jkdBlue'>
                <Table className='w-full'>
                    <TableHeader className='bg-gray-800'>
                        <TableRow>
                            <TableHead className='py-4 px-4 text-white w-80'>
                                Situation
                            </TableHead>
                            {filteredData.map((course) => (
                                <TableHead
                                    key={course.title.toLowerCase()} // Normalisation du titre
                                    className='py-4 px-4 text-white uppercase max-md:text-xs max-md:text-center'
                                >
                                    {course.title}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className='py-4 px-4 text-jkdBlue uppercase font-bold max-md:text-xs max-md:text-center'>
                                Inscription
                            </TableCell>
                            {filteredData.map((course) => (
                                <TableCell
                                    key={course.title.toLowerCase()} // Normalisation du titre
                                    className={`py-4 px-4 text-white ${
                                        filter !== 'All' &&
                                        course.title.toLowerCase() !== filter
                                            ? 'opacity-30'
                                            : 'bg-gray-900'
                                    }`}
                                >
                                    {course.price.inscription}€
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className='py-4 px-4 text-jkdBlue uppercase font-bold max-md:text-xs max-md:text-center'>
                                Demandeur d&apos;emploi/Étudiant
                            </TableCell>
                            {filteredData.map((course) => (
                                <TableCell
                                    key={course.title.toLowerCase()} // Normalisation du titre
                                    className={`py-4 px-4 text-white ${
                                        filter !== 'All' &&
                                        course.title.toLowerCase() !== filter
                                            ? 'opacity-30'
                                            : 'bg-gray-900'
                                    }`}
                                >
                                    {course.price.reduced
                                        ? `${course.price.reduced}€`
                                        : '-'}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className='py-4 px-4 text-jkdBlue uppercase font-bold max-md:text-xs max-md:text-center'>
                                À partir de la 5ème année
                            </TableCell>
                            {filteredData.map((course) => (
                                <TableCell
                                    key={course.title.toLowerCase()} // Normalisation du titre
                                    className={`py-4 px-4 ${
                                        filter !== 'All' &&
                                        course.title.toLowerCase() !== filter
                                            ? 'opacity-30'
                                            : 'bg-gray-900'
                                    }`}
                                >
                                    {course.price.fifth_year
                                        ? `${course.price.fifth_year}€`
                                        : '-'}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* Deuxième section : Horaires */}
            <div className='shadow-lg shadow-jkdBlue'>
                <Table className='w-full'>
                    <TableHeader className='bg-gray-800'>
                        <TableRow>
                            <TableHead className='py-4 px-4 text-white w-80'>
                                Horaires
                            </TableHead>
                            {filteredData.map((course) => (
                                <TableHead
                                    key={course.title.toLowerCase()} // Normalisation du titre
                                    className='py-4 px-4 text-white uppercase max-md:text-xs max-md:text-center'
                                >
                                    {course.title}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className='py-4 px-4 text-jkdBlue uppercase font-bold max-md:text-xs max-md:text-center'>
                                Mardi
                            </TableCell>
                            {filteredData.map((course) => (
                                <TableCell
                                    key={course.title.toLowerCase()} // Normalisation du titre
                                    className={`py-4 px-4 max-md:text-center  ${
                                        filter !== 'All' &&
                                        course.title.toLowerCase() !== filter
                                            ? 'opacity-30'
                                            : 'bg-gray-900'
                                    }`}
                                >
                                    {isDesktop
                                        ? course.schedule.tuesday
                                        : simplifyTimeRange(
                                              course.schedule.tuesday
                                          )}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className='py-4 px-4 text-jkdBlue uppercase font-bold max-md:text-xs max-md:text-center'>
                                Mercredi
                            </TableCell>
                            {filteredData.map((course) => (
                                <TableCell
                                    key={course.title.toLowerCase()} // Normalisation du titre
                                    className={`py-4 px-4 max-md:text-center ${
                                        filter !== 'All' &&
                                        course.title.toLowerCase() !== filter
                                            ? 'opacity-30'
                                            : 'bg-gray-900'
                                    }`}
                                >
                                    {isDesktop
                                        ? course.schedule.wednesday
                                        : simplifyTimeRange(
                                              course.schedule.wednesday
                                          )}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className='py-4 px-4 text-jkdBlue uppercase font-bold max-md:text-xs max-md:text-center'>
                                Jeudi
                            </TableCell>
                            {filteredData.map((course) => (
                                <TableCell
                                    key={course.title.toLowerCase()} // Normalisation du titre
                                    className={`py-4 px-4 max-md:text-center ${
                                        filter !== 'All' &&
                                        course.title.toLowerCase() !== filter
                                            ? 'opacity-30'
                                            : 'bg-gray-900'
                                    }`}
                                >
                                    {isDesktop
                                        ? course.schedule.thursday
                                        : simplifyTimeRange(
                                              course.schedule.thursday
                                          )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </FadeInWrapper>
    );
}
