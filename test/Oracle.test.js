const assert=require("assert");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "---enter your Infurakey here---";
const privateKey = "---enter your PrivateKey here---";

const Web3 = require("web3");	
let provider = new HDWalletProvider([privateKey], `https://kovan.infura.io/v3/${infuraKey}`,0,1);
const web3=new Web3(provider);

let accounts;
let instanceOracleTest=require('../build/contracts/Edge196OracleTest.json');
let testContract;

beforeEach(async()=>{
//get list of all accounts
accounts=await web3.eth.getAccounts();

testContract=await new web3.eth.Contract(instanceOracleTest.abi)
.deploy({data:instanceOracleTest.bytecode})
.send({from:accounts[0],gas:'3000000'});
});


describe("EDGE196 Oracle TestCase",()=>{
	it("Contract Deployed",()=>{	
		assert.ok(testContract.options.address);	
	});

	it("function fetchLatestPrice should able to fetch ETH-USD price and create an struct entry for the same",async ()=>{	

        await testContract.methods.fetchLatestPrice().send({
            from:accounts[0],
        });
        const storedData = await testContract.methods.getData(0).call({
            from:accounts[0],
        });

        assert.notStrictEqual(storedData[1], 0);
        assert.notStrictEqual(storedData[2], 0);
	});

	it("function deleteData should delete an entry data stored at specific index",async ()=>{	

        await testContract.methods.fetchLatestPrice().send({
            from:accounts[0],
        });
        let storedData = await testContract.methods.getData(0).call({
            from:accounts[0],
        });

        assert.notStrictEqual(storedData[1], 0);
        assert.notStrictEqual(storedData[2], 0);

        await testContract.methods.deleteData(0).send({
            from:accounts[0],
        });

        storedData = await testContract.methods.getData(0).call({
            from:accounts[0],
        });

        assert.strictEqual(parseInt(storedData[1]), 0);
        assert.strictEqual(parseInt(storedData[2]), 0);
	});

    it("function calculateMean returns the Mean price for a specific data set range",async ()=>{	

        await testContract.methods.fetchLatestPrice().send({
            from:accounts[0],
        });
        await testContract.methods.fetchLatestPrice().send({
            from:accounts[0],
        });
        await testContract.methods.fetchLatestPrice().send({
            from:accounts[0],
        });
        const dataAtIndex1 = await testContract.methods.getData(0).call({
            from:accounts[0],
        });
        const dataAtIndex2 = await testContract.methods.getData(1).call({
            from:accounts[0],
        });
        const dataAtIndex3 = await testContract.methods.getData(2).call({
            from:accounts[0],
        });

        const desiredMean = (parseInt(dataAtIndex1.fetchedPrice)+parseInt(dataAtIndex2.fetchedPrice)+parseInt(dataAtIndex3.fetchedPrice))/3;
        const calculateMean = await testContract.methods.calculateMean(0,2).call({
            from:accounts[0],
        });

        assert.strictEqual(calculateMean, desiredMean.toFixed(0));
	});
});