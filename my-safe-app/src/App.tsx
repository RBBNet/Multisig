import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import Web3 from 'web3';

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

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()

  const submitTx = useCallback(async () => {
    try {  
      const web3 = new Web3('https://rinkeby.infura.io/v3/token');
      const contract = new web3.eth.Contract([
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
      ], "0x286BC950212AAA43Af72879db5B09b2303EAaE66");

      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: "0x286BC950212AAA43Af72879db5B09b2303EAaE66",
            value: '0',
            data: contract.methods.set(984).encodeABI(), //chama a função set do contrato deployado na rinkeby, passando como parâmetro o número 984
          },
        ],
      })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk])

  return (
    <Container>
      <Title size="md">Safe: {safe.safeAddress}</Title>

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
