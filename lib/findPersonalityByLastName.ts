export interface Personality {
    firstName: string;
    lastName: string;
    title: string;
    flagUrl?: string;
    imgUrl: string;
    shortInfo?: string;
    withMoreInfo: boolean;
}

interface Branch {
    firstBranch?: Personality[];
    secondBranch?: Personality[];
    thirdBranch?: Personality[];
    fourthBranch?: Personality[];
}

type PersonalitiesData = Branch[];

const flattenPersonalities = (data: PersonalitiesData): Personality[] => {
    return data.flatMap((branch) => Object.values(branch).flat());
};

export const findPersonalitiesByLastNames = (
    lastNames: string[],
    data: PersonalitiesData
): Personality[] => {
    const flattenedData = flattenPersonalities(data);
    const lowerCaseLastNames = lastNames.map((name) => name.toLowerCase());

    return flattenedData.filter((personality) =>
        lowerCaseLastNames.includes(personality.lastName.toLowerCase())
    );
};
