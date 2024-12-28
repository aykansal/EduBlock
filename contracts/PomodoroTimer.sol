// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PomodoroTimer {
    struct User {
        uint256 startTime;
        uint256 rewardBalance;
    }

    address public owner;
    uint256 public rewardPerTask;
    uint256 public requiredDuration = 40 minutes;

    mapping(address => User) public users;

    // Events
    event TimerStarted(address indexed user, uint256 startTime);
    event TaskCompleted(address indexed user, uint256 reward);
    event TaskFailed(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier hasStarted(address _user) {
        require(users[_user].startTime > 0, "No timer has been started.");
        _;
    }

    constructor(uint256 _rewardPerTask) {
        owner = msg.sender;
        rewardPerTask = _rewardPerTask;
    }

    function startTimer() external {
        require(users[msg.sender].startTime == 0, "Timer already started.");
        users[msg.sender].startTime = block.timestamp;
        emit TimerStarted(msg.sender, block.timestamp);
    }

    function completeTask() external hasStarted(msg.sender) {
        uint256 duration = block.timestamp - users[msg.sender].startTime;

        if (duration >= requiredDuration) {
            // Task completed successfully
            users[msg.sender].rewardBalance += rewardPerTask;
            emit TaskCompleted(msg.sender, rewardPerTask);
        } else {
            // Task failed
            emit TaskFailed(msg.sender);
        }

        // Reset the timer
        users[msg.sender].startTime = 0;
    }

    function withdrawRewards() external {
        uint256 reward = users[msg.sender].rewardBalance;
        require(reward > 0, "No rewards available to withdraw.");

        // Reset the reward balance before transferring
        users[msg.sender].rewardBalance = 0;

        // Use the `call` method to transfer funds
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Transfer failed.");
    }

    function depositFunds() external payable onlyOwner {
        // Owner can deposit Ether to fund rewards
    }

    function setReward(uint256 _rewardPerTask) external onlyOwner {
        rewardPerTask = _rewardPerTask;
    }

    function setDuration(uint256 _minutes) external onlyOwner {
        requiredDuration = _minutes * 1 minutes;
    }

    function getUserDetails(address _user) external view returns (uint256, uint256) {
        return (users[_user].startTime, users[_user].rewardBalance);
    }
}
