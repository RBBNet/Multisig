import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { EthersAdapter } from '@gnosis.pm/safe-core-sdk'
import { ContractNetworksConfig, ContractNetworkConfig} from '@gnosis.pm/safe-core-sdk/dist/src/configuration/contracts';
import { ethers } from 'ethers';
import { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk'
import Safe from '@gnosis.pm/safe-core-sdk'
import {SafeTransactionDataPartial} from '@gnosis.pm/safe-core-sdk-types';

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Link = styled.a`
  margin-top: 8px;
`

declare global {
  interface Window {
      ethereum:any;
  }
}

const ethereum = window.ethereum

/*
const provider = new ethers.providers.JsonRpcProvider();
const wallet = ethers.Wallet.createRandom().connect(provider);

const ethLibAdapter = new EthersAdapter({ ethers, signer: wallet });*/


let adresssafe=""

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()

  const submitTx = useCallback(async () => {
    try {  
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(ethereum)
      //await ethereum.request({ method: 'net_version',    });
      //await ethereum.request({ method: 'eth_requestAccounts' });
      //var address = await this.ethereum.request({ method: 'eth_accounts' });
      const owner1 = provider.getSigner()
      const ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signer: owner1
      })
      const confignet : ContractNetworkConfig = {
        multiSendAddress: '0x5782b77C665e99Dc19F8d69A63E1697846d51b01',
          safeMasterCopyAddress: '0xdB6FC7603DdC91F027379267A3549D28E65484D5',
          safeProxyFactoryAddress: '0xAADFe7925b0Cad895665aDE74f5848043B8c4b7D'
      }
      const configContract: ContractNetworksConfig = {'1337': confignet }
      const safeFactory = await SafeFactory.create({ ethAdapter:ethAdapterOwner1, contractNetworks: configContract})
      const owners = ['0x2961A23E2a64668cCeF8f7dc74F25b0594448b23', '0xEA2c859e955F52Ad9b3F86Aa1C6c4117d8f58aA5', '0xAf4E7290C62D43B7D2f4337228f14d5B56aB22BC']
      const threshold = 3
      const safeAccountConfig: SafeAccountConfig = { owners, threshold }
      const safeSdk: Safe = await safeFactory.deploySafe(safeAccountConfig)

      adresssafe = safeSdk.getAddress()
      console.log(adresssafe);
      const lisowners = await safeSdk.getOwners()
      console.log(lisowners)
      //const appsSdk = new SafeAppsSDK();
      //const safe = await appsSdk.safe.getInfo();
      //console.log(safe)
      /*const cpk = await CPK.create({ ethLibAdapter, networks: {
        1337: {
          masterCopyAddress: '0xdB6FC7603DdC91F027379267A3549D28E65484D5',
          proxyFactoryAddress: '0xAADFe7925b0Cad895665aDE74f5848043B8c4b7D',
          multiSendAddress: '0x5782b77C665e99Dc19F8d69A63E1697846d51b01',
          fallbackHandlerAddress: '0xe41649fF5586a6d022E4402c168757982a9e09Fb',
        },
      },
    });*/

      //const web3 = new Web3('https://rinkeby.infura.io/v3/token');
      const contract = new ethers.Contract("0xAb0c07cD7dE1DAA2Cb211213e4072Bb0CAE41EB9",[
        {
          "constant": false,
          "inputs": [
            {
              "name": "n",
              "type": "uint256"
            }
          ],
          "name": "decrement",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "x",
              "type": "uint256"
            }
          ],
          "name": "set",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "get",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "n",
              "type": "uint256"
            }
          ],
          "name": "increment",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ], provider)
      console.log(contract)
      const methodName = "set";
      const params = [123];
      const transactions: SafeTransactionDataPartial[] = [{
        to: '0xAb0c07cD7dE1DAA2Cb211213e4072Bb0CAE41EB9',
        value: '0',
        data: contract.interface.encodeFunctionData(methodName,params),
        safeTxGas: 220000
      }]
      const safeTransaction = await safeSdk.createTransaction(...transactions)
      await safeSdk.signTransaction(safeTransaction)
      const owner2 = provider.getSigner("0xEA2c859e955F52Ad9b3F86Aa1C6c4117d8f58aA5")
      const ethAdapterOwner2 = new EthersAdapter({ ethers, signer: owner2 })
const safeSdk2 = await safeSdk.connect({ ethAdapter: ethAdapterOwner2, safeAddress: adresssafe, contractNetworks: configContract})

const txHash = await safeSdk2.getTransactionHash(safeTransaction)
const approveTxResponse = await safeSdk2.approveTransactionHash(txHash)
await approveTxResponse.transactionResponse?.wait()
const owner3 = provider.getSigner("0xAf4E7290C62D43B7D2f4337228f14d5B56aB22BC")
const ethAdapterOwner3 = new EthersAdapter({ ethers, signer: owner3 })
const safeSdk3 = await safeSdk2.connect({ ethAdapter: ethAdapterOwner3, safeAddress:adresssafe })
const executeTxResponse = await safeSdk3.executeTransaction(safeTransaction)
await executeTxResponse.transactionResponse?.wait()
      /*
      const { transactionResponse, hash } = await cpk.execTransactions([
        {
          to: contract.address,
          data: contract.interface.functions.set.encode([984]
          ),
        },
      ]);*/

      /*const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: "0x286BC950212AAA43Af72879db5B09b2303EAaE66",
            value: '0',
            data: contract.methods.set(984).encodeABI(), //chama a função set do contrato deployado na rinkeby, passando como parâmetro o número 984
          },
        ],
      })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })*/
      //console.log({ transactionResponse, hash })
    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk])

  return (
    <Container>
      <Title size="md">Safe: {adresssafe}</Title>

      <Button size="lg" color="primary" onClick={submitTx}>
        Click to send a test transaction
      </Button>

      <Link href="https://github.com/gnosis/safe-apps-sdk" target="_blank" rel="noreferrer">
        Documentation
      </Link>
    </Container>
  )
}

export default SafeApp
