import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moveTeamMember, selectTeamIds } from 'src/features/team/teamSlice.js';
import { formatTeamOrderAnnouncement } from 'src/features/team/lib/formatTeamOrderAnnouncement.js';

export const useTeamReorder = () => {
  const dispatch = useDispatch();
  const total = useSelector(selectTeamIds).length;
  const [announcement, setAnnouncement] = useState(null);

  const moveMember = ({ from, to, name }) => {
    dispatch(moveTeamMember({ from, to }));
    setAnnouncement(formatTeamOrderAnnouncement(name, to + 1, total));
  };

  return { moveMember, announcement };
};
