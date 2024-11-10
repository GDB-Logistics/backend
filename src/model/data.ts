const works = [
  new Array<string>(),
  new Array<string>(),
  new Array<string>(),
];

export const pushNewWork = (work: string): number => {
  const pendingWork1 = works[0].length;
  const pendingWork2 = works[1].length;
  const pendingWork3 = works[2].length;

  const workLoads = [pendingWork1, pendingWork2, pendingWork3];

  const smalestWorkLoad = [pendingWork1, pendingWork2, pendingWork3].sort()[0];

  works[workLoads.indexOf(smalestWorkLoad)].push(work);
  return smalestWorkLoad;
};
