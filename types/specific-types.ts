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
