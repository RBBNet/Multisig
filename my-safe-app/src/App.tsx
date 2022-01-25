import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { SafeFactory, EthersAdapter } from '@gnosis.pm/safe-core-sdk'
import Safe from '@gnosis.pm/safe-core-sdk'
import { ethers } from 'ethers';

import { SafeTransactionDataPartial, SafeTransaction } from '@gnosis.pm/safe-core-sdk-types';


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

let addresssafe=""
let safeTransaction:SafeTransaction;
let safeSdk:Safe;
let ethAdapterOwner1:EthersAdapter;
let provider:ethers.providers.Web3Provider;
let configContract:any;
const safeVersion = "1.3.0";


const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const createMS = useCallback(async () => {
    try {  
      await ethereum.request({ method: 'eth_requestAccounts' });
      provider = new ethers.providers.Web3Provider(ethereum)
      const owner1 = provider.getSigner(0)
      ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signer: owner1
      })
      
      /*
      *** CONFIGURE ESTE BLOCO [INÍCIO] ***
      */
      configContract = {'': { //Dentro das aspas, insira o id da rede
        multiSendAddress: '', //Dentro das aspas, insira o endereço do contrato multiSend (gerado ao fazer o deploy)
        safeMasterCopyAddress: '', //Dentro das aspas, insira o endereço do contrato safeMasterCopy (gerado ao fazer o deploy)
        safeProxyFactoryAddress: '' //Dentro das aspas, insira o endereço do contrato safeProxyFactory (gerado ao fazer o deploy)
      } }
      const safeFactory = await SafeFactory.create({ ethAdapter:ethAdapterOwner1, isL1SafeMasterCopy: true, contractNetworks: configContract, safeVersion: safeVersion})
      const threshold = 3 //Defina a quantidade de proprietários da carteira (para este exemplo está sendo 3)
      const owners = ['', '', ''] //Dentro das aspas, insira os endereços dos 3 (neste exemplo) proprietários da carteira
      /*
      *** CONFIGURE ESTE BLOCO [FIM] ***
      */
     
      const safeSdkd = await safeFactory.deploySafe({ owners, threshold })
      
      safeSdk = await safeSdkd.connect({ ethAdapter: ethAdapterOwner1, isL1SafeMasterCopy: true, safeAddress: addresssafe, contractNetworks: configContract})

      addresssafe = safeSdk.getAddress()
      console.log(addresssafe);
      /* Exemplo de abi
      [ 
        {
          "inputs": [],
          "name": "retrieve",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "num",
              "type": "uint256"
            }
          ],
          "name": "store",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]*/
      
      /*
      *** CONFIGURE ESTE BLOCO [INÍCIO] ***
      */      
      const contract = new ethers.Contract("", [], provider)
      //Dentro das aspas, insira o endereço do contrato a ser utilizado pela carteira
      //Dentro dos colchetes, insira a abi do contrato a ser utilizado pela carteira
      const methodName = ""; //Dentro das aspas, insira o nome do método do contrato a ser utilizado pela carteira
      const params = []; //Dentro dos colchetes, insira os parâmetros do método do contrato a ser utilizado pela carteira
      const transactions: SafeTransactionDataPartial = {
        to: '', //Dentro das aspas, insira o endereço do contrato a ser utilizado pela carteira
        value: '0',
        data: contract.interface.encodeFunctionData(methodName,params),
        safeTxGas: 220000,
        gasPrice: 0,
      }
      /*
      *** CONFIGURE ESTE BLOCO [FIM] ***
      */
      
      safeTransaction = await safeSdk.createTransaction(transactions)

    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk])
  const submitTx = useCallback(async () => {
    
    const txHash1 = await safeSdk.getTransactionHash(safeTransaction)
    const approveTxResponse1 = await safeSdk.approveTransactionHash(txHash1);
    await approveTxResponse1.transactionResponse?.wait()

}, [safe,sdk])

const assign = useCallback(async () => {
    /*
    *** CONFIGURE ESTE BLOCO [INÍCIO] ***
    */
    const owner2 = provider.getSigner("") //Dentro das aspas, insira o endereço do owner2
    /*
    *** CONFIGURE ESTE BLOCO [FIM] ***
    */
      
    const ethAdapterOwner2 = new EthersAdapter({ ethers, signer: owner2 })
    const safeSdk2 = await safeSdk.connect({ ethAdapter: ethAdapterOwner2, safeAddress: addresssafe, contractNetworks: configContract})
    const txHash2 = await safeSdk2.getTransactionHash(safeTransaction)
    const approveTxResponse = await safeSdk2.approveTransactionHash(txHash2);
    await approveTxResponse.transactionResponse?.wait()

}, [safe,sdk])
const execute = useCallback(async () => {  
  /*
  *** CONFIGURE ESTE BLOCO [INÍCIO] ***
  */      
  const owner3 = provider.getSigner("") //Dentro das aspas, insira o endereço do owner3
  /*
  *** CONFIGURE ESTE BLOCO [FIM] ***
  */
      
  const ethAdapterOwner3 = new EthersAdapter({ ethers, signer: owner3 })
  const safeSdk3 = await safeSdk.connect({ ethAdapter: ethAdapterOwner3, safeAddress:addresssafe })
  const options = {
    gasLimit: 2200000,
    gasPrice: 0,
  }
  const executeTxResponse = await safeSdk3.executeTransaction(safeTransaction,options)
  await executeTxResponse.transactionResponse?.wait()
  
}, [safe,sdk])

  return (
    <Container>
      <Title size="md">Safe: {addresssafe}</Title>

      <Button size="md" color="primary" onClick={createMS}> Create Wallet </Button>

      <Button size="md" color="primary" onClick={submitTx}> Assign Owner 1 </Button>

      <Button size="md" color="primary" onClick={assign}>
        Assign Owner 2
      </Button>


      <Button size="md" color="primary" onClick={execute}>
        Assign e execute Owner 3
      </Button>

      <Link href="https://github.com/gnosis/safe-apps-sdk" target="_blank" rel="noreferrer">
        Documentation
      </Link>
    </Container>
  )
}

export default SafeApp
