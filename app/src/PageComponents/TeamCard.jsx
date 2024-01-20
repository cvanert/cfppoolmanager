function TeamCard({ team }) {
    if (team.rank === 2 || team.rank === 3) {
        return (

            <div className='teamCard' key={`${team.abbreviation}${team.rank}`}>
                <div className='teamLogo logoLeft'>
                    <img src={team.logo} alt={`${team.nickname} Logo`} />
                </div>
                <TeamCardContainer team={team} />
            </div>
        )
    };
    return (
        <div className='teamCard' key={`${team.abbreviation}${team.rank}`}>
            <TeamCardContainer team={team} />
            <div className='teamLogo logoRight'>
                <img src={team.logo} alt={`${team.nickname} Logo`} />
            </div>
        </div>
    );
}

function TeamCardContainer({ team }) {
    return (
        <div className='teamInfo'>
            <div className='teamRank'>{team.rank}</div>
            <div className='teamSchool'>{team.nickname}</div>
            <div className='teamMascot'>{team.name}</div>
        </div>
    );
}

export default TeamCard;