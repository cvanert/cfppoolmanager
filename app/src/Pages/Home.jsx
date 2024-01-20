import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styling/App.css'
import Rankings from '../PageComponents/Rankings';
import cfpLogoDarkScreenNav from '../images/cfpLogoDarkScreenNav.png';
import cfpLogoDarkScreenNavLines from '../images/cfpLogoDarkScreenNavLines.png';
import { ethers } from 'ethers';
import { formatDate } from '../helpers/formatDateString';

function Home() {
  const [poolAddress, setPoolAddress] = useState('');
  const [rankings, setRankings] = useState([]);
  const [champTeamOne, setChampTeamOne] = useState();
  const [champTeamTwo, setChampTeamTwo] = useState();
  const [nationalChamp, setNationalChamp] = useState();
  const [cTeamOneScore, setCTeamOneScore] = useState();
  const [cTeamTwoScore, setCTeamTwoScore] = useState();
  // const [semiOneTime, setSemiOneTime] = useState('');
  // const [semiTwoTime, setSemiTwoTime] = useState('');
  // const [champTime, setChampTime] = useState('');
  const inputAddress = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRankings() {
      try {
        const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings`);

        if (!response) {
          throw new Error(`HTTP error. Status: ${response.status}.`);
        }

        const data = await response.json();
        console.log('data', data);
        const endDate = data.latestSeason.endDate;

        if (new Date(endDate).getTime() < new Date().getTime()) {
          try {
            const response = await fetch('http://sports.core.api.espn.com/v2/sports/football/leagues/college-football/seasons/2023/types/2/weeks/15/rankings/21?lang=en&region=us');

            if (!response) {
              throw new Error(`HTTP error. Status: ${response.status}.`);
            }
            const ranksData = await response.json();
            const ranks = ranksData.ranks.slice(0, 4);
            const ranksPromises = [];

            for (let i = 0; i < ranks.length; i++) {
              try {
                const teamResponse = await fetch(`${ranks[i].team.$ref}`);
                const teamData = await teamResponse.json();
                const teamObject = {
                  rank: ranks[i].current,
                  abbreviation: await teamData.abbreviation,
                  id: await teamData.id,
                  logo: await teamData.logos[0].href,
                  name: await teamData.name,
                  nickname: await teamData.nickname,
                  color: await teamData.color
                }
                ranksPromises.push(teamObject);

                if (!teamResponse) {
                  throw new Error(`HTTP error. Status: ${response.status}.`);
                }
              } catch (e) {

              }
              setRankings(await Promise.all(ranksPromises));
            }

          } catch (e) {
            console.error('Error fetching data:', e);
          } finally {
            setLoading(false);
          }
        } else {
          const ranks = data.rankings[0].ranks.slice(0, 4);
          const ranksPromises = [];

          for (let i = 0; i < ranks.length; i++) {
            const teamObject = {
              rank: ranks[i].current,
              abbreviation: await ranks[i].team.abbreviation,
              id: await ranks[i].team.id,
              logo: await ranks[i].team.logos[0].href,
              name: await ranks[i].team.name,
              nickname: await ranks[i].team.nickname,
              color: await ranks[i].team.color,
            }
            ranksPromises.push(teamObject);

            setRankings(await Promise.all(ranksPromises));
          }
        }

      } catch (e) {
        console.error('Error fetching data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, []);

  useEffect(() => {
    async function fetchNextGame(teamAbbr, teamRank) {
      try {
        const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${teamAbbr}`);

        if (!response) {
          throw new Error(`HTTP error. Status: ${response.status}.`);
        }

        const data = await response.json();
        const nextGames = data.team.nextEvent;
        console.log('nextGames', nextGames[0].date);

        // if (teamRank === 1) {
        //   setSemiOneTime(nextGames[0].date);
        // }
        // if (teamRank === 4) {
        //   setSemiTwoTime(nextGames[0].date);
        // }


        if (nextGames.length == 2) {
          const natty = data.team.nextEvent[1].competitions[0];
          console.log('natty', natty)
          // setChampTime(natty.date);
          const nattyTeams = natty.competitors;

          nattyTeams.map((t) => {
            const rank = t.curatedRank.current;
            if (rank === 1 || rank === 4) {
              setChampTeamOne(t);
              if (t.score !== undefined && t.score.value !== undefined) {
                setCTeamOneScore(t.score.value);
              }
            } else {
              setChampTeamTwo(t);
              if (t.score !== undefined && t.score.value !== undefined) {
                setCTeamTwoScore(t.score.value);
              }
            }

            if (t.winner !== undefined) {
              if (t.winner === true) {
                setNationalChamp(t);
              }
            }
          });
          return true;
        }
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    }

    async function fetchWinners() {
      const promises = rankings.find((t) => {
        const teamAbbr = t.abbreviation;
        const teamRank = t.rank;
        return fetchNextGame(teamAbbr, teamRank);
      });

      try {
        await Promise.resolve(promises);
      } catch (e) {
        console.error('Error fetching winners:', e);
      }
    }

    if (champTeamOne === undefined && champTeamTwo === undefined) {
      fetchWinners();
    }
  }, [rankings]);

  return (
    <>
      <div className='homeTopContainer'>
        <div className="head">
          <div className='homeTitleContainer'>
            <div className='homeTitleTopLine'>
              <nav className='navbar'>
                <div className='homeNav'>
                  <img src={cfpLogoDarkScreenNavLines} alt='Home' className='cfpHomeButton' />
                  <div className='backText'></div>
                </div>
              </nav>
              <div className='homeNavTitle'>College Football Playoff</div>
              <div></div>
            </div>
            <div className='homeNavTitle'>Pool Manager</div>
          </div>
        </div>
        <div className='homeCFPTeamsContainer'>
          {loading ? (
            <p>Loading rankings...</p>
          ) : (
            <Rankings rankings={rankings} champTeamOne={champTeamOne} champTeamTwo={champTeamTwo} nationalChamp={nationalChamp} cTeamOneScore={cTeamOneScore} cTeamTwoScore={cTeamTwoScore} isEntry={false} isChampComplete={false} />
          )}
        </div>
      </div>
      <div className='belowRankingsContainer'>
        <div className='bottomContainer'>
          <div className='bodyLeftContainer'>
            <div className='homeDeployDescription bottomInstructions'>Click to Deploy New CFP Pool Manager
            </div>
            <div className='buttonContainer'>
              <button
                className='homeDeployButton'
                type="button"
                onClick={() => {
                  console.log('Rankings before navigating:', rankings);
                  navigate(`/Deploy`, { state: { rankings, /*semiOneTime, semiTwoTime, champTime*/ } });
                }}
              >
                Create Pool
              </button>
            </div>
          </div>
          <div className='homeJoinContainer bodyRightContainer'>
            <div className='addressInputContainer'>

              <input
                type='text'
                className='addressInput'
                ref={inputAddress}
                placeholder='Enter Pool Address'
              >
              </input>
            </div>
            <div className='interactButtonsContainer'>
              <div className='buttonContainer'>
                <button
                  className='homeJoinButton homeInteractButton'
                  type="button"
                  onClick={(e) => {
                    if (ethers.isAddress(inputAddress.current.value)) {
                      setPoolAddress((prevAddress) => {
                        return inputAddress.current.value;
                      });
                      navigate(`/JoinPool/${inputAddress.current.value}`, { state: { rankings } });
                    } else {
                      inputAddress.current.style.borderColor = 'red'
                      inputAddress.current.value = 'Enter valid pool address'
                    }
                  }}
                >Join Pool</button>
              </div>
              <div className='buttonContainer'>
                <button
                  className='homeManageButton homeInteractButton'
                  type="button"
                  onClick={(e) => {
                    if (ethers.isAddress(inputAddress.current.value)) {
                      setPoolAddress((prevAddress) => {
                        return inputAddress.current.value;
                      });
                      navigate(`/PoolManagement/${inputAddress.current.value}`, { state: { rankings, champTeamOne, champTeamTwo, nationalChamp, cTeamOneScore, cTeamTwoScore } });
                    } else {
                      inputAddress.current.style.borderColor = 'red'
                      inputAddress.current.value = 'Enter valid pool address'
                    }
                  }}
                >
                  Manage Pool
                </button>
              </div>
              <div className='buttonContainer'>
                <button
                  className='homeStandingsButton homeInteractButton'
                  type="button"
                  onClick={(e) => {
                    if (ethers.isAddress(inputAddress.current.value)) {
                      setPoolAddress((prevAddress) => {
                        return inputAddress.current.value;
                      });
                      navigate(`/Standings/${inputAddress.current.value}`, { state: { rankings, champTeamOne, champTeamTwo, nationalChamp, cTeamOneScore, cTeamTwoScore } });
                    } else {
                      inputAddress.current.style.borderColor = 'red'
                      inputAddress.current.value = 'Enter valid pool address'
                    }
                  }}
                >
                  Pool Standings
                </button>
              </div>
              <div className='buttonContainer'>
                <button
                  className='homeMyBracketsButton homeInteractButton'
                  type="button"
                  onClick={(e) => {
                    if (ethers.isAddress(inputAddress.current.value)) {
                      setPoolAddress((prevAddress) => {
                        return inputAddress.current.value;
                      });
                      navigate(`/MyBrackets/${inputAddress.current.value}`, { state: { rankings, champTeamOne, champTeamTwo, nationalChamp, cTeamOneScore, cTeamTwoScore } });
                    } else {
                      inputAddress.current.style.borderColor = 'red'
                      inputAddress.current.value = 'Enter valid pool address'
                    }
                  }}
                >
                  My Brackets
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home