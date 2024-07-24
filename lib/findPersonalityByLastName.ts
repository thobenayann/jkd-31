export interface LongInfo {
    [key: string]: string | undefined;
}
export interface PersonalityType {
    firstName: string;
    lastName: string;
    title: string;
    flagUrl?: string;
    imgUrl: string;
    shortInfo?: string;
    withMoreInfo: boolean;
    longInfo?: LongInfo[];
}

interface Branch {
    firstBranch?: PersonalityType[];
    secondBranch?: PersonalityType[];
    thirdBranch?: PersonalityType[];
    fourthBranch?: PersonalityType[];
}

type PersonalitiesData = Branch[];

const flattenPersonalities = (data: PersonalitiesData): PersonalityType[] => {
    return data.flatMap((branch) => Object.values(branch).flat());
};

export const findPersonalitiesByLastNames = (
    lastNames: string[],
    data: PersonalitiesData
): PersonalityType[] => {
    const flattenedData = flattenPersonalities(data);
    const lowerCaseLastNames = lastNames.map((name) => name.toLowerCase());

    return flattenedData.filter((personality) =>
        lowerCaseLastNames.includes(personality.lastName.toLowerCase())
    );
};
