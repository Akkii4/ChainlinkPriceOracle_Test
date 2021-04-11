# EDGE196-smart-contracts

### Prerequisite

1. Install dependencies by running npm i.
2. Create .secret file in project root.
3. Add your private Key & infura key to truffle-config and Oracle.test in the respective variable.

NOTE: This private Key will be used to deploy contracts thus make sure that you have enough ETH.

## Test
```
npm run test
```

## Deployment
```
truffle migrate --network kovan
```