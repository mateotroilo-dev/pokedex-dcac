import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore } from 'src/app/store.js';
import { useTeamReorder } from 'src/features/team/hooks/useTeamReorder.js';
import { TEAM_REDUCER_PATH } from 'src/shared/lib/constants/store.js';

const wrapperWithTeam = (ids) => {
  const store = makeStore({ [TEAM_REDUCER_PATH]: { ids } });
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  return { Wrapper, store };
};

describe('useTeamReorder', () => {
  it('starts with a null announcement', () => {
    const { Wrapper } = wrapperWithTeam([1, 2, 3]);

    const { result } = renderHook(() => useTeamReorder(), { wrapper: Wrapper });

    expect(result.current.announcement).toBeNull();
  });

  it('moveMember dispatches the move and sets the announcement text', () => {
    const { Wrapper, store } = wrapperWithTeam([1, 2, 3]);

    const { result } = renderHook(() => useTeamReorder(), { wrapper: Wrapper });

    act(() => result.current.moveMember({ from: 0, to: 2, name: 'pikachu' }));

    expect(store.getState()[TEAM_REDUCER_PATH].ids).toEqual([2, 3, 1]);
    expect(result.current.announcement).toBe('pikachu movido a la posición 3 de 3');
  });
});
