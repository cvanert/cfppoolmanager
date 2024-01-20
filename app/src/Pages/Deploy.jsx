import { useLocation } from "react-router-dom";
import { useRef, useState } from 'react';
import { ethers } from 'ethers';
import '../styling/App.css';
import '../styling/JoinPool.css'
import Navigation from '../PageComponents/Navigation';
import Rankings from "../PageComponents/Rankings";
import PoolConfirm from '../PageComponents/PoolConfirm';

const provider = new ethers.BrowserProvider(window.ethereum);

function Deploy() {
  const location = useLocation();
  const { rankings, /*semiOneTime, semiTwoTime, champTime*/} = location.state || {};
  const [signer, setSigner] = useState();
  const [entryFee, setEntryFee] = useState(0);
  const [maxEntries, setMaxEntries] = useState(1);
  const [unlockDate, setUnlockDate] = useState(new Date());
  const [lockDate, setLockDate] = useState(new Date());
  const [semiDate, setSemiDate] = useState(new Date());
  const [champDate, setChampDate] = useState(new Date());
  const [deployedAddress, setDeployedAddress] = useState();
  const [error, setError] = useState();

  const teams = [];
  rankings.map(t => {
    teams.push(Number(t.id));
  });

  async function getAccounts() {
    const accounts = await provider.send('eth_requestAccounts', []);
    setSigner(await provider.getSigner());
    return accounts[0];
  };

  const updateUnlockDate = (event) => {
    setUnlockDate(event.target.value);
  }
  const updateLockDate = (event) => {
    setLockDate(event.target.value);
  }
  const updateSemiDate = (event) => {
    setSemiDate(event.target.value);
  }
  const updateChampDate = (event) => {
    setChampDate(event.target.value);
  }

  const updateFee = (event) => {
    setEntryFee(event.target.value);
  }

  const updateEntries = (event) => {
    setMaxEntries(event.target.value);
  }

  const updateDeployedAddress = (address) => {
    setDeployedAddress(address);
  };

  const updateError = (e) => {
    setError(e);
  };

  return (
    <>
      <Navigation />
      <div className='homeCFPTeamsContainer'>
        {rankings && (
          <div>
            <Rankings rankings={rankings} isEntry={false} />
          </div>
        )}
      </div>
      <div className='belowRankingsContainer poolContainer'>
        <div className='bottomContainer'>
          {(() => {
            if (signer !== undefined && deployedAddress === undefined) {
              return (
                <>
                  <div className='bodyLeftContainer'>
                    <div className='entrantInstructionsDiv'>
                      <p className='entrantInstructions bottomInstructions'>Pool Specifics</p>
                    </div>
                    <div className='poolSelectionsDiv poolSelectionsContainer entrantSelectionsDiv'>
                      <div className='entrantSelectionsSpacing'>
                        <div className='poolCategoryDiv entryFee'>
                          <div className='poolLabel'>Entry Fee (ETH):</div>
                          <div className='inputValueDiv'>
                            <input className='inputValue' type='number' onChange={updateFee}></input>
                          </div>
                        </div>
                        <div className='poolCategoryDiv entries'>
                          <div className='poolLabel'>Maximum Entries:</div>
                          <div className='inputValueDiv'>
                            <input className='inputValue' type='number' onChange={updateEntries} min='1'></input>
                          </div>
                        </div>
                        <div className='poolCategoryDiv unlockDate'>
                          <div className='poolLabel formLabel'>Unlock Date:</div>
                          <div className='inputValueDiv'>
                            <input className='inputValue poolDate' type='datetime-local' value={unlockDate} onChange={updateUnlockDate} />
                          </div>
                        </div>
                        <div className='poolCategoryDiv lockDate'>
                          <div className='poolLabel formLabel'>Lock Date:</div>
                          <div className='inputValueDiv'>
                            <input className='inputValue poolDate' type='datetime-local' value={lockDate} onChange={updateLockDate} />
                          </div>
                        </div>
                        <div className='poolCategoryDiv semisDate'>
                          <div className='poolLabel formLabel'>Semifinals Date:</div>
                          <div className='poolValue inputValueDiv'>
                            <input className='inputValue poolDate' type='datetime-local' value={semiDate} onChange={updateSemiDate} />
                          </div>
                        </div>
                        <div className='poolCategoryDiv champDate'>
                          <div className='poolLabel formLabel'>Championship Date:</div>
                          <div className='inputValueDiv'>
                            <input className='inputValue poolDate' type='datetime-local' value={champDate} onChange={updateChampDate} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            } else if (signer === undefined) {
              return (
                <>
                  <div className='connectWalletDiv'>
                    <div className='connectWalletButtonDiv'>
                      <button type='button' onClick={getAccounts} className='connectWalletButton'>Connect Wallet</button>
                    </div>
                  </div>
                </>
              )
            } else {
              return (
                <>
                  <div className='bodyLeftContainer'>
                    <div className='entrantInstructionsDiv'>
                      <p className='entrantInstructions bottomInstructions'>Pool Specifics</p>
                    </div>
                    <PoolConfirm entryFee={entryFee} maxEntries={maxEntries} teams={teams} unlockDate={unlockDate} lockDate={lockDate} semiDate={semiDate} champDate={champDate} signer={signer} updateDeployedAddress={updateDeployedAddress} updateError={updateError} hasButton={false} />
                  </div>
                </>
              )
            }
          })()}
          <div className='bodyRightContainer'>
            {(() => {
              if (deployedAddress !== undefined && error === undefined) {
                return (
                  <>
                    <div className='entrantInstructionsDiv'>
                      <p className='successInstructions bottomInstructions'>CFP Pool Contract Address:</p>
                    </div>
                    <div className='entrantSelectionsDiv'>
                      <div className='entrantSelectionsSpacing'>
                        <div className='entrantCategoryDiv'>
                          <div className='entrantLabel successText'>Pool Address:</div>
                          {deployedAddress && (
                            <div className='entrantValue successText'>{deployedAddress}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )
              } else if (deployedAddress === undefined && error !== undefined) {
                return (
                  <>
                    <div className='entrantInstructionsDiv'>
                      <p className='errorInstructions bottomInstructions'>CFP Pool Contract Address:</p>
                    </div>
                    <div className='entrantSelectionsDiv'>
                      <div className='entrantSelectionsSpacing'>
                        <div className='errorText'>{error}</div>
                      </div>
                    </div>
                  </>
                )
              } else {
                return (
                  <>
                    <div className='entrantInstructionsDiv'>
                      <p className='entrantInstructions bottomInstructions'>Confirm Pool Specifics</p>
                    </div>
                    <PoolConfirm entryFee={entryFee} maxEntries={maxEntries} teams={teams} unlockDate={unlockDate} lockDate={lockDate} semiDate={semiDate} champDate={champDate} signer={signer} updateDeployedAddress={updateDeployedAddress} updateError={updateError} hasButton={true} />
                  </>
                )
              }
            })()}
          </div>
        </div>
      </div>
    </>
  )
}

export default Deploy