var Web3 = require('web3');
var readlineSync = require('readline-sync');
var fs = require('fs');
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const version = web3.version
const total_votes=1

var contract_address = '0x233D027084C2126A584F66B40e658C40ab300969'
contract_abi=JSON.parse(fs.readFileSync('YOUR_PATH/interface'))
var  CommitReveal = new web3.eth.Contract(contract_abi, contract_address);


const voting = async () =>{

let accounts = await web3.eth.getAccounts();
account =accounts[0]

//get the endTime
let time_end =await  CommitReveal.methods.commitPhaseEndTime().call({from: account}).then(function(endtime){
	return endtime
});


 	while(Date.now()/1000 < time_end) {

        var vote = readlineSync.question('The time is not up, you can still vote,  What is your vote? ');
        const commit = web3.utils.soliditySha3(vote);

	var commitVote =  CommitReveal.methods.commitVote(commit).call({from: account}).then(function(result){
//        console.log("the commit result is:",result);
        });

	var commitsArray = await CommitReveal.methods.getVoteCommitsArray().call({from: account}).then(function(result){
//        console.log("the commitsArray is", result)
	})
	}

// check the numberOfVotesCast, and get the winer when the all the votes are casted
        var numberOfVotesCast =  CommitReveal.methods.numberOfVotesCast().call({from: account}).then(function(number){
	while(number < total_votes){
	
	// prompt for revealing vote
        console.log("we are waiting for more votes to be casted")
        var vote_given = readlineSync.question('please input your given vote, if you have not done it yet');
        const commit_given = web3.utils.soliditySha3(vote_given);

	// revealing Vote
        var revealVote =   CommitReveal.methods.revealVote(vote_given,commit_given).call({from: account}).then(function(result)        {
        console.log("the reveal vote results are:",result);
        });

	}
	
	console.log("Time to declear the winner,hold your breath")
	var winner = CommitReveal.methods.getWinner().call({from: account}).then(function(winner){
        console.log("Congrats, the winner is:", winner);
        })
	
        });
}
voting()
