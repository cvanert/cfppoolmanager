import { useEffect, useState } from 'react';
import Bracket from './Bracket';
import '../styling/Bracket.css';

function Rankings({ rankings, champTeamOne, champTeamTwo, nationalChamp, cTeamOneScore, cTeamTwoScore, isEntry, isChampComplete, updateSemiWinnerLeft, updateSemiWinnerRight, updateChampion, updateFinalScoreLeft, updateFinalScoreRight }) {
    const [error, setError] = useState(null);
    const bracket = [];
    bracket.push(rankings[0]);
    bracket.push(rankings[3]);
    bracket.push(rankings[1]);
    bracket.push(rankings[2]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!rankings) {
        return <div>Loading rankings...</div>;
    }

    if (rankings.length < 4) {
        return <div>Not enough rankings data.</div>;
    }

    return (
        <>
            <div className='bodyTopContainer'>
                    <div className='cfpTeamsContainer'>
                        <Bracket teams={bracket} champTeamOne={champTeamOne} champTeamTwo={champTeamTwo} nationalChamp={nationalChamp} cTeamOneScore={cTeamOneScore} cTeamTwoScore={cTeamTwoScore} isEntry={isEntry} isChampComplete={isChampComplete} updateSemiWinnerLeft={updateSemiWinnerLeft} updateSemiWinnerRight={updateSemiWinnerRight} updateChampion={updateChampion} updateFinalScoreLeft={updateFinalScoreLeft} updateFinalScoreRight={updateFinalScoreRight} />
                    </div>
            </div>
        </>
    )
}

export default Rankings;  