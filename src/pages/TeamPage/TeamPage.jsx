import { useSelector } from 'react-redux';
import EmptyState from 'src/shared/ui/EmptyState/EmptyState.jsx';
import Grid from 'src/shared/ui/Grid/Grid.jsx';
import PageLayout from 'src/shared/ui/PageLayout/PageLayout.jsx';
import VisuallyHidden from 'src/shared/ui/VisuallyHidden/VisuallyHidden.jsx';
import TeamMemberCard from 'src/features/team/components/TeamMemberCard/TeamMemberCard.jsx';
import { useTeamReorder } from 'src/features/team/hooks/useTeamReorder.js';
import { selectTeamIds } from 'src/features/team/teamSlice.js';
import { TEAM_MEMBER_CARD_MIN_WIDTH } from 'src/features/team/constants.js';
import { EMPTY_TEAM_MESSAGE } from 'src/pages/TeamPage/TeamPage.constants.js';

const TeamPage = () => {
  const ids = useSelector(selectTeamIds);
  const { moveMember, announcement } = useTeamReorder();

  return (
    <PageLayout>
      {ids.length === 0 ? (
        <EmptyState message={EMPTY_TEAM_MESSAGE} />
      ) : (
        <Grid minItemWidth={TEAM_MEMBER_CARD_MIN_WIDTH}>
          {ids.map((id, index) => (
            <TeamMemberCard key={id} id={id} index={index} total={ids.length} onMove={moveMember} />
          ))}
        </Grid>
      )}
      <VisuallyHidden role="status">{announcement}</VisuallyHidden>
    </PageLayout>
  );
};

export default TeamPage;
