import { useSelector } from 'react-redux';
import EmptyState from 'src/shared/ui/EmptyState/EmptyState.jsx';
import Grid from 'src/shared/ui/Grid/Grid.jsx';
import PageLayout from 'src/shared/ui/PageLayout/PageLayout.jsx';
import TeamMemberCard from 'src/features/team/components/TeamMemberCard/TeamMemberCard.jsx';
import { selectTeamIds } from 'src/features/team/teamSlice.js';
import { TEAM_MEMBER_CARD_MIN_WIDTH } from 'src/features/team/constants.js';
import { EMPTY_TEAM_MESSAGE } from 'src/pages/TeamPage/TeamPage.constants.js';

const TeamPage = () => {
  const ids = useSelector(selectTeamIds);

  return (
    <PageLayout>
      {ids.length === 0 ? (
        <EmptyState message={EMPTY_TEAM_MESSAGE} />
      ) : (
        <Grid minItemWidth={TEAM_MEMBER_CARD_MIN_WIDTH}>
          {ids.map((id) => (
            <TeamMemberCard key={id} id={id} />
          ))}
        </Grid>
      )}
    </PageLayout>
  );
};

export default TeamPage;
