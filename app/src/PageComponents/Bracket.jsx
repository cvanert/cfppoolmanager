import { useState } from "react";
import TeamCard from "./TeamCard";
import cfpLogo from '../images/cfpLogo.png';
import cfpLogoDarkScreen from '../images/cfpLogoDarkScreen.png';

function Bracket({ teams, champTeamOne, champTeamTwo, nationalChamp, cTeamOneScore, cTeamTwoScore, isEntry, isChampComplete, updateSemiWinnerLeft, updateSemiWinnerRight, updateChampion, updateFinalScoreLeft, updateFinalScoreRight }) {
    const [updateBracket, setUpdateBracket] = useState(false);
    const [leftScore, setLeftScore] = useState('');
    const [rightScore, setRightScore] = useState('');
    const [semiWinnerLeft, setSemiWinnerLeft] = useState(null);
    const [semiWinnerRight, setSemiWinnerRight] = useState(null);
    const [champion, setChampion] = useState(null);

    function handleClick(winningTeamId, winningTeamName, winningTeamAbbr, winningTeamRank, teamImg, alt, left, semi) {
        if (isEntry) {
            setUpdateBracket(true);
            if (semi) {
                if (left) {
                    const semiWinner = {
                        id: winningTeamId,
                        winningTeamName: winningTeamName,
                        abbreviation: winningTeamAbbr,
                        rank: winningTeamRank,
                        img: teamImg,
                        alt: alt,
                        left: true,
                        champ: false
                    };
                    updateSemiWinnerLeft(semiWinner);
                    updateChampion(null);
                    updateFinalScoreLeft('');
                    updateFinalScoreRight('');

                    setSemiWinnerLeft(semiWinner);
                    setChampion(null);
                    setLeftScore('');
                    setRightScore('');
                } else {
                    const semiWinner = {
                        id: winningTeamId,
                        winningTeamName: winningTeamName,
                        abbreviation: winningTeamAbbr,
                        rank: winningTeamRank,
                        img: teamImg,
                        alt: alt,
                        left: false,
                        champ: false
                    };
                    updateSemiWinnerRight(semiWinner);
                    updateChampion(null);
                    updateFinalScoreLeft('');
                    updateFinalScoreRight('');

                    setSemiWinnerRight(semiWinner);
                    setChampion(null);
                    setLeftScore('');
                    setRightScore('');
                }
            } else {
                const champ = {
                    id: winningTeamId,
                    winningTeamName: winningTeamName,
                    abbreviation: winningTeamAbbr,
                    rank: winningTeamRank,
                    img: teamImg,
                    alt: alt,
                    left: false,
                    champ: true
                };
                updateChampion(champ);
                setChampion(champ);
            }
        }
    }

    function FinalsTeamDiv({ teamId, teamName, abbr, rank, teamImg, alt, left, champ }) {

        if (champ) {
            return (
                <div className='finalsTeamLogo'>
                    <img src={teamImg} alt={alt} />
                </div>
            )
        } else if (!isEntry) {
            <div className='finalsTeamLogoContainer'>
                <div className='semisWinnerDiv'>
                    <img src={teamImg} alt={alt} />
                </div>
            </div>
        }
        return (
            <button type='button' className='semiWinnerButton' id={left && !champ ? 'semiWinnerButtonLeft' : !left && !champ ? 'semiWinnerButtonRight' : 'selectedChampion'} key={`champ${rank}`} onClick={() => handleClick(teamId, teamName, abbr, rank, teamImg, `${rank} Logo`, false, false)}>
                <div className='finalsTeamLogo'>
                    <img src={teamImg} alt={alt} />
                </div>
            </button>
        );
    }

    return (
        <div className='bracket'>
            <div className='semifinals semifinalsLeft'>
                <div className='semifinalsTeams'>
                    <div className='semisTopTeam'>
                        <button type='button' className='teamCardButton' id={teams[0].abbreviation} style={{background:`linear-gradient(to right, #${teams[0].color}, black)`}} key={`${teams[0].abbreviation}${teams[0].rank}`} onClick={() => handleClick(teams[0].id, `${teams[0].nickname} ${teams[0].name}`, teams[0].abbreviation, teams[0].rank, teams[0].logo, `${teams[0].nickname} Logo`, true, true)}>
                            <TeamCard team={teams[0]} />
                        </button>
                    </div>
                    <div className='semisBottomTeam'>
                        <button type='button' className='teamCardButton' id={teams[1].abbreviation} style={{background:`linear-gradient(to right, #${teams[1].color}, black)`}} key={`${teams[1].abbreviation}${teams[1].rank}`} onClick={() => handleClick(teams[1].id, `${teams[1].nickname} ${teams[1].name}`, teams[1].abbreviation, teams[1].rank, teams[1].logo, `${teams[1].nickname} Logo`, true, true)}>
                            <TeamCard team={teams[1]} />
                        </button>
                    </div>
                </div>
                <div className='bracketLineDivLeft'>
                    <div className='bracketLineLeft'></div>
                </div>
            </div>
            <div className='finalsDiv'>
                <div className='finalsLineLeftDiv'>
                    <div className='finalsLineContainer'>
                        {(() => {
                            if (updateBracket) {
                                return (
                                    <FinalsTeamDiv teamId={semiWinnerLeft?.id} teamName={semiWinnerLeft?.winningTeamName} abbr={semiWinnerLeft?.abbreviation} rank={semiWinnerLeft?.rank} teamImg={semiWinnerLeft?.img} alt={semiWinnerLeft?.alt} left={semiWinnerLeft?.left} champ={semiWinnerLeft?.champ} />
                                )
                            } else if (champTeamOne !== undefined) {
                                return (
                                    <FinalsTeamDiv teamId={champTeamOne?.id} teamName={champTeamOne?.team?.displayName} abbr={champTeamOne?.team?.abbreviation} rank={champTeamOne?.curatedRank?.current} teamImg={champTeamOne?.team?.logos[0].href} alt={champTeamOne?.team?.displayName + ' logo'} left={true} champ={false} />
                                )
                            } else {
                                return <div className='finalsLineTop'></div>
                            }
                        })()}
                        <div className='finalsLineBottom'></div>
                    </div>
                </div>
                <div className='finalsCenterDiv'>
                    <div className='finalsCFPLogoDiv'>
                        <img src={cfpLogoDarkScreen} className='cfpLogoImg' alt='CFP Logo' />
                    </div>
                    {(() => {
                        if (updateBracket && isChampComplete) {
                            return (
                                <div className='finalsScoreDiv'>
                                    <h4 className="finalsScoreTitle">Final Score</h4>
                                    <div className='finalsScoreInputDiv'>
                                        <input className='finalsScoreLeft' type='text' pattern='[0-9]*' value={leftScore} onChange={(e) => {
                                            setLeftScore((score) => (e.target.validity.valid ? e.target.value : score));
                                            updateFinalScoreLeft((score) => (e.target.validity.valid ? e.target.value : score));
                                        }} />
                                        <input className='finalsScoreRight' type='text' pattern='[0-9]*' value={rightScore} onChange={(e) => {
                                            setRightScore((score) => (e.target.validity.valid ? e.target.value : score));
                                            updateFinalScoreRight((score) => (e.target.validity.valid ? e.target.value : score))
                                        }} />
                                    </div>
                                </div>
                            )
                        } else if (cTeamOneScore !== undefined) {
                            return (
                                <div className='finalsScoreDiv'>
                                    <h4 className="finalsScoreTitle nattyScoreTitle">Final Score</h4>
                                    <div className='nattyScoreDiv'>
                                        <div className='nattyScoreLeft'>{cTeamOneScore}</div>
                                        <div className='nattyScoreDivider'>-</div>
                                        <div className='nattyScoreRight'>{cTeamTwoScore}</div>
                                    </div>
                                </div>
                            )
                        } else {
                            return <div className='finalsScoreDiv'></div>
                        }
                    })()}
                    <div className='finalsWinnerDiv'>

                        {(() => {
                            if (updateBracket && isChampComplete && champion !== null) {
                                return (
                                    <>
                                        <div className='finalsWinnerImgDiv'>
                                            <FinalsTeamDiv teamId={champion?.id} teamName={champion?.winningTeamName} abbr={champion?.abbreviation} rank={champion?.rank} teamImg={champion?.img} alt={champion?.alt} left={champion?.left} champ={champion?.champ} />
                                        </div>
                                    </>
                                )
                            } else if (nationalChamp !== undefined) {
                                return (
                                    <>
                                        <div className='finalsWinnerImgDiv'>
                                            <FinalsTeamDiv teamId={nationalChamp?.id} teamName={nationalChamp?.team?.displayName} abbr={nationalChamp?.team?.abbreviation} rank={nationalChamp?.curatedRank?.current} teamImg={nationalChamp?.team?.logos[0].href} alt={nationalChamp?.team?.displayName + 'logo'} left={false} champ={true} />
                                        </div>
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <div className='finalsWinnerEmptyImgDiv'>
                                            <div className='finalsWinnerEmptyDiv'></div>
                                        </div>
                                    </>
                                )
                            }
                        })()}

                    </div>
                </div>
                <div className='finalsLineRighttDiv'>
                    <div className='finalsLineContainer'>
                        {(() => {
                            if (updateBracket) {
                                return (
                                    <FinalsTeamDiv teamId={semiWinnerRight?.id} teamName={semiWinnerRight?.winningTeamName} abbr={semiWinnerRight?.abbreviation} rank={semiWinnerRight?.rank} teamImg={semiWinnerRight?.img} alt={semiWinnerRight?.alt} left={semiWinnerRight?.left} champ={semiWinnerRight?.champ} />
                                )
                            } else if (champTeamOne !== undefined) {
                                return (
                                    <FinalsTeamDiv teamId={champTeamTwo?.id} teamName={champTeamTwo?.team?.displayName} abbr={champTeamTwo?.team?.abbreviation} rank={champTeamTwo?.curatedRank?.current} teamImg={champTeamTwo?.team?.logos[0].href} alt={champTeamTwo?.team?.displayName + ' logo'} left={true} champ={false} />
                                )
                            } else {
                                return <div className='finalsLineTop'></div>
                            }
                        })()}
                        <div className='finalsLineBottom'></div>
                    </div>
                </div>
            </div>
            <div className='semifinals semifinalsRight'>
                <div className='bracketLineDivRight'>
                    <div className='bracketLineRight'></div>
                </div>
                <div className='semifinalsTeams'>
                    <div className='semisTopTeam'>
                        <button type='button' className='teamCardButton' id={teams[2].abbreviation} style={{background:`linear-gradient(to left, #${teams[2].color}, black)`}} key={`${teams[2].abbreviation}${teams[2].rank}`} onClick={() => handleClick(teams[2].id, `${teams[2].nickname} ${teams[2].name}`, teams[2].abbreviation, teams[2].rank, teams[2].logo, `${teams[2].nickname} Logo`, false, true)}>
                            <TeamCard team={teams[2]} />
                        </button>
                    </div>
                    <div className='semisBottomTeam'>
                        <button type='button' className='teamCardButton' id={teams[3].abbreviation} style={{background:`linear-gradient(to left, #${teams[3].color}, black)`}} key={`${teams[3].abbreviation}${teams[3].rank}`} onClick={() => handleClick(teams[3].id, `${teams[3].nickname} ${teams[3].name}`, teams[3].abbreviation, teams[3].rank, teams[3].logo, `${teams[3].nickname} Logo`, false, true)}>
                            <TeamCard team={teams[3]} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bracket;