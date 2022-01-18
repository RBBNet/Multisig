import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { Factory, TxContractMS } from './multiSig';

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

let transaction:TxContractMS;

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const createMS = useCallback(async () => {
    try {  

      const factory = new Factory('id', 'multiSendAddress', 'safeMasterCopyAddress','safeProxyFactoryAddress');
      
      const carteira = await factory.createWallet(['owner1', 'owner2', 'owner3'], 3);
      
      const addresssafe = carteira.getAddress()
      console.log(addresssafe);

      const contract = factory.defineContract("contractAddress",[
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
      ])
      transaction = await contract.createTransaction(carteira, 'store', [777])
    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk])
  const submitTx = useCallback(async () => {

    transaction.approve();

}, [safe,sdk])

const assign = useCallback(async () => {

  transaction.approve();

}, [safe,sdk])
const execute = useCallback(async () => {

  transaction.execute();
  
}, [safe,sdk])

  return (
    <Container>
      <Title size="md">Safe</Title>

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
