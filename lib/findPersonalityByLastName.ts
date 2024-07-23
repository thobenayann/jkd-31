interface Personality {
    firstName: string;
    lastName: string;
    title: string;
    imgUrl: string;
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

export const findPersonalityByLastName = (
    lastName: string,
    data: PersonalitiesData
): Personality | undefined => {
    const flattenedData = flattenPersonalities(data);
    return flattenedData.find(
        (personality) =>
            personality.lastName.toLowerCase() === lastName.toLowerCase()
    );
};
