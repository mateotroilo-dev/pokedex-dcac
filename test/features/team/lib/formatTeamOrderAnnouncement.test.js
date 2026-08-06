import { formatTeamOrderAnnouncement } from 'src/features/team/lib/formatTeamOrderAnnouncement.js';

describe('formatTeamOrderAnnouncement', () => {
  it('announces the pokemon moved to a middle position', () => {
    expect(formatTeamOrderAnnouncement('pikachu', 3, 6)).toBe(
      'pikachu movido a la posición 3 de 6',
    );
  });

  it('announces the pokemon moved to the first position', () => {
    expect(formatTeamOrderAnnouncement('pikachu', 1, 6)).toBe(
      'pikachu movido a la posición 1 de 6',
    );
  });

  it('announces the pokemon moved to the last position', () => {
    expect(formatTeamOrderAnnouncement('pikachu', 6, 6)).toBe(
      'pikachu movido a la posición 6 de 6',
    );
  });
});
