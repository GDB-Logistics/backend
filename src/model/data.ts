const works = new Map<string, Array<string>>();

works.set('abraham', new Array<string>());
works.set('endre', new Array<string>());
works.set('tamas', new Array<string>());

const names = ['abraham', 'endre', 'tamas'];

export const pushNewWork = (work: string): string => {
    const pendingWork1 = works.get('abraham')?.length;
    const pendingWork2 = works.get('endre')?.length;
    const pendingWork3 = works.get('tamas')?.length;

    const workLoads = [pendingWork1, pendingWork2, pendingWork3];

    const smalestWorkLoad = [pendingWork1, pendingWork2, pendingWork3].sort()[0];

    const selectedName = names[workLoads.indexOf(smalestWorkLoad)];

    const selectedWorkArray = works.get(selectedName);
    selectedWorkArray?.push(work);

    return selectedName;
};

export const removeCompletedWork = (userId: string, work: string): void => {
    const selectedWorkArray = works.get(userId);
    selectedWorkArray?.filter((i) => i === work);
};
