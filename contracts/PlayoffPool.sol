// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract PlayoffPool  {
    struct Bracket {
        address owner;
        uint semifinalOneWinner;
        uint semifinalTwoWinner;
        uint champion;
        uint championshipTotalPoints;
        uint bracketPoints;
        uint id;
    }

    address public commissioner;
    uint public entryFee;
    uint public maxEntries;
    uint public one;
    uint public two;
    uint public three;
    uint public four;
    uint public semifinalOneWinner;
    uint public semifinalTwoWinner;
    uint public champion;
    uint public championshipTotalPoints;
    uint public mostPoints;
    uint public totalEntries;
    uint public pot;
    uint public unlockTimestamp;
    uint public lockTimestamp;
    uint public semisComplete;
    uint public champComplete;
    uint public randNonce = 1;

    Bracket[] public allBrackets;
    Bracket[] public scoredAfterSemis;
    Bracket[] public scoredAfterChamp;
    address[] public entrants;
    uint[] public winningIDs;
    mapping(address => uint) public entries;
    // EOA >> Bracket >> points
    mapping(address => Bracket[]) public brackets;
    // Points >> EOA
    mapping(uint => address[]) public points;
    // Points >> Bracket
    mapping(uint => Bracket[]) public scoredBrackets;
    // Difference in guessed final score and actual final score >> EOA
    mapping(uint => address[]) public differences;
    // Difference in guessed final score and actual final score >> ID
    mapping(uint => uint[]) public differencesIDs;

    event Winner(address, uint);
    // EOA, amount, split, number of winners
    event WinnerPaid(address, uint, bool, uint);
    // Winners of Semifinals
    event ScoredSemis(uint, uint);

    constructor (uint _entryFee, uint _maxEntries, uint _one, uint _two, uint _three, uint _four, uint _unlockTimestamp, uint _lockTimestamp, uint _semisComplete, uint _champComplete) {
        commissioner = msg.sender;
        entryFee = _entryFee;
        maxEntries = _maxEntries;
        one = _one;
        two = _two;
        three = _three;
        four = _four;
        unlockTimestamp = _unlockTimestamp;
        lockTimestamp = _lockTimestamp;
        semisComplete = _semisComplete;
        champComplete = _champComplete;
    }

    // Get random ID
    function randMod(address _entrant, uint _champion, uint _championshipTotalPoints) internal returns(uint) {
        randNonce++;
        return uint(keccak256(abi.encodePacked(block.timestamp, _entrant, _champion, _championshipTotalPoints, randNonce))) % 1000000;
    }

    function joinPool(uint _semifinalOneWinner, uint _semifinalTwoWinner, uint _champion, uint _championshipTotalPoints) public payable {
        require(msg.value == entryFee, "Incorrect entry fee.");
        require(block.timestamp >= unlockTimestamp, "CFP selections have not been finalized.");
        require(block.timestamp <= lockTimestamp, "Entry period has closed.");
        require(entries[msg.sender] < maxEntries, "Maximum amount of entries reached for this address.");

        uint rand = randMod(msg.sender, _champion, _championshipTotalPoints);

        if (entries[msg.sender] <= 0) {
            entrants.push(msg.sender);
        }
        entries[msg.sender]++;
        brackets[msg.sender].push(Bracket(
            msg.sender,
            _semifinalOneWinner,
            _semifinalTwoWinner,
            _champion,
            _championshipTotalPoints,
            0,
            rand
        ));
        allBrackets.push(Bracket(
            msg.sender,
            _semifinalOneWinner,
            _semifinalTwoWinner,
            _champion,
            _championshipTotalPoints,
            0,
            rand
        ));
        totalEntries++;
        pot = address(this).balance;
    }

    // Get semifinal outcomes
    function scoreSemifinal(uint _semifinalOneWinner, uint _semifinalTwoWinner) public {
        require(msg.sender == commissioner, "Not authorized.");
        require(block.timestamp >= semisComplete, "Cannot score until Semifinals have been played.");
        semifinalOneWinner = _semifinalOneWinner;
        semifinalTwoWinner = _semifinalTwoWinner;
        scoreBracket(true);
    }

    // Get final outcome
    function scoreFinal(uint _champion, uint _championshipTotalPoints) public {
        require(msg.sender == commissioner, "Not authorized.");
        require(block.timestamp >= champComplete, "Cannot score until National Championship has been played.");
        champion = _champion;
        championshipTotalPoints = _championshipTotalPoints;
        scoreBracket(false);
        determineWinner();
    }

    // Score entries
    function scoreBracket(bool isSemi) internal {
        // require(msg.sender == commissioner);
        address eoa;
        Bracket storage bracket;

        for (uint i = 0; i < entrants.length; i++) {
            eoa = entrants[i];
            for (uint j = 0; j < entries[eoa]; j++) {
                bracket = brackets[eoa][j];
                // Calculate score
                if (isSemi) {
                    if (bracket.semifinalOneWinner == semifinalOneWinner) {
                        brackets[eoa][j].bracketPoints += 3;
                    }
                    if (bracket.semifinalTwoWinner == semifinalTwoWinner) {
                        brackets[eoa][j].bracketPoints += 3;
                    }
                    scoredAfterSemis.push(brackets[eoa][j]);
                    emit ScoredSemis(semifinalOneWinner, semifinalTwoWinner);
                } else {
                    if (bracket.champion == champion) {
                        brackets[eoa][j].bracketPoints += 7;
                    }
                    if (brackets[eoa][j].bracketPoints > mostPoints) {
                        mostPoints = brackets[eoa][j].bracketPoints;
                    }
                    points[brackets[eoa][j].bracketPoints].push(eoa);
                    scoredBrackets[brackets[eoa][j].bracketPoints].push(brackets[eoa][j]);
                    scoredAfterChamp.push(brackets[eoa][j]);
                }
            }
        }
    }

    function getAllEntries() public view returns (Bracket[] memory) {
        Bracket[] storage tmp;
        if (scoredAfterChamp.length > 0) {
            tmp = scoredAfterChamp;
        } else if (scoredAfterSemis.length > 0) {
            tmp = scoredAfterSemis;
        } else {
            tmp = allBrackets;
        }

        Bracket[] memory bracketsArray = new Bracket[](tmp.length);

        for (uint i = 0; i < tmp.length; i++) {
            bracketsArray[i] = tmp[i];
        }
        return (bracketsArray);
    }

    function getMyBrackets() public view returns (Bracket[] memory, uint) {
        Bracket[] storage tmp = brackets[msg.sender];
        Bracket[] memory bracketsArray = new Bracket[](tmp.length);

        for (uint i = 0; i < tmp.length; i++) {
            bracketsArray[i] = tmp[i];
        }
        return (bracketsArray, entries[msg.sender]);
    }

    function getWinnerIDs() public view returns (uint[] memory) {
        return (winningIDs);
    }

    // Determine winner
    function determineWinner() internal {
        // require(msg.sender == commissioner);
        pot = address(this).balance;
        uint closest;
        uint dif;
        Bracket storage bracket;

        if (points[mostPoints].length == 1) {
            // Winner
            payWinner(points[mostPoints][0], 1);
            emit Winner(points[mostPoints][0], mostPoints);
        } else {
            for (uint i = 0; i < points[mostPoints].length; i++) {
                bracket = scoredBrackets[mostPoints][i];
                if (bracket.championshipTotalPoints > championshipTotalPoints) {
                    dif = bracket.championshipTotalPoints - championshipTotalPoints;
                } else {
                    dif = championshipTotalPoints - bracket.championshipTotalPoints;
                }

                if (i == 0) {
                    closest = dif;
                } else if (dif < closest) {
                    closest = dif;
                }
                differencesIDs[dif].push(bracket.id);
                differences[dif].push(bracket.owner);
            }
            // See if there's a tie
            if (differences[closest].length == 1) {
                winningIDs.push(differencesIDs[closest][0]);
                payWinner(differences[closest][0], 1);
                emit Winner(differences[closest][0], mostPoints);
            } else {
                // Divide contract's balance by winners
                uint n = differences[closest].length;

                for (uint i = 0; i < n; i++) {
                    winningIDs.push(differencesIDs[closest][i]);
                    payWinner(differences[closest][i], n);
                    emit Winner(differences[closest][i], mostPoints);
                }
            }
        }
    }

    function payWinner(address _winner, uint _numberOfWinners) internal {
        uint prize = pot/_numberOfWinners;
        (bool sent, ) = _winner.call{ value: prize }("");
        require(sent, "Failed to send winnings.");
        emit WinnerPaid(_winner, prize, _numberOfWinners > 1, _numberOfWinners);
    }

}