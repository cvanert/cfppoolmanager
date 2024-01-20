import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { deployPool } from '../helpers/deployPool';
import { dateSelected, formatDate } from '../helpers/formatDateString';

function PoolConfirm({ entryFee, maxEntries, teams, unlockDate, lockDate, semiDate, champDate, signer, updateDeployedAddress, updateError, hasButton }) {
    const [isLoading, setIsLoading] = useState(false);
    const unlockTimestamp = new Date(unlockDate).getTime() / 1000;
    const lockTimestamp = new Date(lockDate).getTime() / 1000;
    const semiTimestamp = new Date(semiDate).getTime() / 1000;
    const champTimestamp = new Date(champDate).getTime() / 1000;

    function validPool() {
        return !dateSelected(unlockDate) && !dateSelected(lockDate) && !dateSelected(semiDate) && !dateSelected(champDate);
    }

    return (
        <>
            <div className="entrantSelectionsDiv entrantSelectionsDivWithButton">
                <div className='entrantSelectionsSpacing'>
                    <div className="selectionsCategoryDiv">
                        <div className="poolLabel">Entry Fee:</div>
                        <div className='poolValue inputValueDiv'>
                            <div className=" selectedValue">{entryFee} ETH</div>
                        </div>
                    </div>
                    <div className="selectionsCategoryDiv">
                        <div className="poolLabel">Maximum Entries:</div>
                        <div className='poolValue inputValueDiv'>
                            <div className=" selectedValue">{maxEntries}</div>
                        </div>
                    </div>
                    <div className="selectionsCategoryDiv">
                        <div className="poolLabel" id="unlockDate">Unlock Date:</div>
                        <div className='poolValue inputValueDiv'>
                            <div className="selectedValue">{formatDate(unlockDate)}</div>
                        </div>
                    </div>
                    <div className="selectionsCategoryDiv">
                        <div className="poolLabel" id="lockDate">Lock Date:</div>
                        <div className='poolValue inputValueDiv'>
                            <div className=" selectedValue">{formatDate(lockDate)}</div>
                        </div>
                    </div>
                    <div className="selectionsCategoryDiv">
                        <div className="poolLabel" id="semiDate">Semifinals Date:</div>
                        <div className='poolValue inputValueDiv'>
                            <div className=" selectedValue">{formatDate(semiDate)}</div>
                        </div>
                    </div>
                    <div className="selectionsCategoryDiv">
                        <div className="poolLabel" id="champDate">Championship Date:</div>
                        <div className='poolValue inputValueDiv'>
                            <div className=" selectedValue">{formatDate(champDate)}</div>
                        </div>
                    </div>
                </div>
                {hasButton && (
                <div className='buttonDiv'>
                    {!isLoading ? (
                    <button
                        type="button"
                        className='homeInteractButton'
                        onClick={async (e) => {
                            if (!validPool()) {
                                if (dateSelected(unlockDate)) {
                                    document.getElementById('unlockDate').style.color = 'red';
                                }
                                if (dateSelected(lockDate)) {
                                    document.getElementById('lockDate').style.color = 'red';
                                }
                                if (dateSelected(semiDate)) {
                                    document.getElementById('semiDate').style.color = 'red';
                                }
                                if (dateSelected(champDate)) {
                                    document.getElementById('champDate').style.color = 'red';
                                }
                            } else {
                                setIsLoading(true);
                                const response = await deployPool(entryFee, maxEntries, teams, unlockTimestamp, lockTimestamp, semiTimestamp, champTimestamp, signer);
                                if (response[0] !== '') {
                                    updateDeployedAddress(response[0]);
                                setIsLoading(false);
                                } else {
                                    updateError(response[1]);
                                    setIsLoading(false);
                                }
                            }
                        }}
                    > Deploy
                    </button>
                    ) : (
                        <button type='button' className='homeInteractButton' disabled={isLoading}>Loading...</button>
                    )}
                </div>
                )}
            </div >
        </>
    )
}

export default PoolConfirm;