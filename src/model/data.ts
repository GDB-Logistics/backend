const works = new Map<string, Array<string>>();

works.set('abraham', new Array<string>());
works.set('endre', new Array<string>());
works.set('tamas', new Array<string>());

const names = ['abraham', 'endre', 'tamas'];

export const pushNewWork = (work: string): string => {
    const pendingWork1 = works.get('abraham')?.length ?? 0;
    const pendingWork2 = works.get('endre')?.length ?? 0;
    const pendingWork3 = works.get('tamas')?.length ?? 0;

    const workLoads = [pendingWork1, pendingWork2, pendingWork3];

    const smallestWorkLoad = Math.min(pendingWork1, pendingWork2, pendingWork3);
    const selectedName = names[workLoads.indexOf(smallestWorkLoad)];

    const selectedWorkArray = works.get(selectedName);
    selectedWorkArray?.push(work);

    return selectedName;
};

export const removeCompletedWork = (userId: string, work: string): void => {
    const selectedWorkArray = works.get(userId);
    if (selectedWorkArray) {
        works.set(
            userId,
            selectedWorkArray.filter((i) => i !== work),
        );
    }
};

// added only for testing purposes
export const getWorks = (worker :string) : Array<string> => {
    return works.get(worker) ?? [];
}

export const resetData = () => {
    works.set('abraham', new Array<string>());
    works.set('endre', new Array<string>());
    works.set('tamas', new Array<string>());
}