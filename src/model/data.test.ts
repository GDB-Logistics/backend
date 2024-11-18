import { pushNewWork, removeCompletedWork, getWorks, resetData } from './data';

describe('Data Tests', () => {
    afterEach(() => {
        resetData();
    });

    test('should handle one data passed in', () => {
        const result = pushNewWork('testWork');
        expect(result).toBe('abraham');
    });
    test('should handle 20 data passed in', () => {
        const works = [
            'testWork1',
            'testWork2',
            'testWork3',
            'testWork4',
            'testWork5',
            'testWork6',
            'testWork7',
            'testWork8',
            'testWork9',
            'testWork10',
            'testWork11',
            'testWork12',
            'testWork13',
            'testWork14',
            'testWork15',
            'testWork16',
            'testWork17',
            'testWork18',
            'testWork19',
            'testWork20',
        ];
        const names = ['abraham', 'endre', 'tamas'];
        for (let i = 0; i < 20; i++) {
            const result = pushNewWork(works[i]);
            expect(names[i % 3]).toBe(result);
        }
    });
});

describe('Data Test with completed', () => {
    afterEach(() => {
        resetData();
    });

    test('should handle one data passed in and removed', () => {
        const result = pushNewWork('testWork');
        removeCompletedWork(result, 'testWork');
        const works = getWorks(result);
        expect(works.length).toBe(0);
    });

    test('should handle assigned to order by least bussiest worker', () => {
        const works = ['testWork1', 'testWork2', 'testWork3'];
        works.forEach((work) => pushNewWork(work));

        removeCompletedWork('tamas', 'testWork3');

        pushNewWork('testWork4');

        expect(getWorks('abraham')).toEqual(['testWork1']);
        expect(getWorks('endre')).toEqual(['testWork2']);
        expect(getWorks('tamas')).toEqual(['testWork4']);
    });

    test('should handle assigned to order by least bussiest worker', () => {
      const works = ['testWork1', 'testWork2', 'testWork3'];
      works.forEach((work) => pushNewWork(work));

      removeCompletedWork('endre', 'testWork2');

      pushNewWork('testWork4');

      expect(getWorks('abraham')).toEqual(['testWork1']);
      expect(getWorks('endre')).toEqual(['testWork4']);
      expect(getWorks('tamas')).toEqual(['testWork3']);
  });

  test('should handle assigned to order by least bussiest worker', () => {
    const works = ['testWork1', 'testWork2', 'testWork3'];
    works.forEach((work) => pushNewWork(work));

    removeCompletedWork('abraham', 'testWork1');

    pushNewWork('testWork4');

    expect(getWorks('abraham')).toEqual(['testWork4']);
    expect(getWorks('endre')).toEqual(['testWork2']);
    expect(getWorks('tamas')).toEqual(['testWork3']);
});
});
