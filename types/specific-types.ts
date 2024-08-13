// Staff
export type StaffRoles =
    | 'Présidente'
    | 'Trésorier'
    | 'Secrétaire'
    | 'Instructeur'
    | 'Responsable communication'
    | 'Responsable technique'
    | 'Assistant'
    | 'Instructeur';

export interface StaffMember {
    name: string;
    role: StaffRoles[];
}

// Cours
export interface CoursePrice {
    inscription: number;
    reduced: number | null;
    fifth_year: number | null;
}

export interface CourseSchedule {
    tuesday: string;
    wednesday: string;
    thursday: string;
}

export interface Course {
    title: string;
    subtitle?: string;
    price: CoursePrice;
    features: string[];
    schedule: CourseSchedule;
}

export type CourseData = Course[];
