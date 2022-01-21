# Multisig

## Deploy

### Hardhat (Recomendado)

* Passo 1: Execute o clone deste repositório: https://github.com/gnosis/safe-contracts.
    ``` 
    git clone https://github.com/gnosis/safe-contracts.git 
    ```
* Passo 2: Acesse o diretório safe-contracts.
    ```
    cd safe-contracts
    ```
* Passo 3: Instale as dependências.
    ``` 
    yarn
    ```
* Passo 4: Acesse o arquivo .env do diretório criado no passo 1, insira em MNEMONIC (dentro das aspas duplas) as 12 palavras de sua carteira, insira em NODE_URL (dentro das aspas duplas) o URL do seu nó e salve o arquivo como .env.
* Passo 5: Acesse o diretório 'contracts', abra o arquivo GnosisSafe.sol, substitua a seguinte função: 
    ```
    function getChainId() public view returns (uint256) {
        uint256 id;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            id := chainid()
        }
        return id;
    }
    ``` 
    por
    
    ```
    function getChainId() public view returns (uint256) {
        return id;
    }
    ```
    substitua a palavra "id" pelo id da sua rede e salve o arquivo. Para algumas redes, a função (antes da substituição) pode não funcionar, por isso, faz-se necessário esta substituição, a fim de garantir a plena execução do código.
* Passo 6: Acesse o arquivo hardhat.config.ts e defina o atributo gas para 0 em networks > hardhat, como segue abaixo:
    ```
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 100000000,
      gas: 0
    },
    ```
* Passo 7: Acesse o diretório 'src/deploy' e atribua o valor false para o atributo 'deterministicDeployment' (presente em todos os arquivos) para todas as ocorrências desse atributo nos arquivos do diretório.
* Passo 8: Faça o deploy.
    ```
    yarn build
    yarn hardhat --network custom deploy
    ```

### Truffle (Não recomendado)

* Passo 1: Reserve um diretório para realizar o deploy e execute o seguinte comando:
    ```
    truffle init
    ```
* Passo 2: Instale o HDWallet provider.
    ```
    npm install --save truffle-hdwallet-provider
    ```
* Passo 3: Acesse o diretório criado no passo 1 e substitua o diretório 'contracts' pelo diretório 'truffle/contracts' deste repositório.
* Passo 4: Acesse o diretório 'migrations' e insira o arquivo '2_deploy_contracts.js' deste repositório localizado em 'truffle/migrations'.
* Passo 5: Substitua o arquivo 'truffle-config.js' pelo arquivo 'truffle-config.js' deste repositório localizado em 'truffle'.
* Passo 6: Abra o arquivo 'truffle-config.js' e insira as 12 palavras de sua carteira, o url do nó da rede e o id da rede nos lugares indicados no arquivo.
* Passo 7: Acesse o diretório 'contracts', abra o arquivo GnosisSafe.sol e na função getChainId() substitua a palavra "id" pelo id da sua rede e salve o arquivo.
* Passo 8: Faça o deploy.
    ```
    truffle deploy --network rbb.
    ```

Após o deploy, anote os endereços gerados para os contratos MultiSend, SafeMasterCopy e GnosisSafeProxyFactory. Eles serão usados no dApp para gerar uma carteira.

## Contratos

* MultiSend: usado para envio de múltiplas transações.
* GnosisSafe (SafeMasterCopy): este contrato é um template de uma carteira.
* GnosisSafeProxyFactory: contrato responsável por instanciar outros contratos utilizando o template mencionado acima. Cada contrato instanciado é o contrato de uma carteira.

O contrato fábrica (GnosisSafeProxyFactory) recebe os parâmetros necessários para gerar uma carteira (threshold, owners...) e faz o deploy do contrato GnosisSafe (template) com estes parâmetros. Cada deploy gera um endereço, este endereço é o endereço da carteira Multisig.

A biblioteca safe-core-sdk foi utilizada para facilitar o acesso e utilização dos métodos dos contratos da Gnosis em uma aplicação (dApp).

Acesse https://github.com/gnosis/safe-core-sdk/tree/main/packages/safe-core-sdk para mais detalhes sobre a biblioteca.

## DAPP (Como utilizar a Multisig em um dApp)

* Passo 1: Clone este repositório.
* Passo 2: Acesse o diretório my-safe-app.
    ```
    cd my-safe-app
    ```
* Passo 3: Instale as dependências.
    ```
    yarn
    ```
* Passo 4: Configure seu dApp em 'my-safe-app/src/App.tsx' (há um exemplo de utilização da biblioteca safe-core-sdk neste caminho) e inicie um servidor local de desenvolvimento.
    ```
    yarn start
    ```

Caso o uso da Multisig seja para um dapp já existente, insira a biblioteca safe-core-sdk através do comando ```yarn add @gnosis.pm/safe-core-sdk``` e siga o exemplo dado em 'my-safe-app/src/App.tsx'.

Para facilitar ainda mais o uso de uma carteira Multisig, uma camada pode ser adicionada entre a biblioteca safe-core-sdk e o dApp a ser utilizado. Algumas classes foram criadas para abstrair o uso da biblioteca safe-core-sdk. Estas classes estão reunidas no arquivo multiSig.ts deste respositório. Para utilizar estas classes, insira o arquivo multiSig.ts deste repositório na pasta src do diretório instalado ou no dapp já existente.

### multiSig.ts

> :warning: **O envio de múltiplas transações não funcionará usando este arquivo!**

Este arquivo possui 3 classes implementadas, são elas:
* Factory: Esta classe é responsável por gerar carteiras.
    * Entrada: id da rede (string), endereço do MultiSend (string), endereço do safeMasterCopy (string) e endereço do GnosisSafeProxyFactory (string). [Estes endereços foram gerados na etapa de deploy]
    * Métodos:
        * createWallet:
            * Entrada: endereços dos proprietários (string[]) e quantidade de proprietários (number).
            * Saída: carteira (Safe).
        * defineContract:
            * Entrada: endereço do contrato a ser utilizado pela carteira (string) e abi deste contrato (ethers.ContractInterface).
            * Saída: objeto do tipo ContractMS.
        * getContractNetworks:
            * Saída: {id da rede (string), endereço do MultiSend (string), endereço do safeMasterCopy (string) e endereço do GnosisSafeProxyFactory (string)}.

* ContractMS: Esta classe é responsável por gerenciar os contratos que serão utilizados por uma carteira gerada.
    * Entrada: endereço do contrato a ser utilizado pela carteira (string), abi deste contrato (ethers.ContractInterface) e objeto do tipo Factory.
    * Métodos:
        * createTransaction:
            * Entrada: carteira (Safe), nome do método do contrato a ser chamado (string) e parâmetros deste método (readonly any[]).
            * Saída: objeto do tipo TxContractMS.
        * getAddress:
            * Saída: endereço do contrato.

* TxContractMS: Esta classe é responsável por gerenciar as transações feitas utilizando a Multisig. 
    * Entrada: transação (SafeTransaction), carteira (Safe) e objeto do tipo Factory.
    * Métodos:
        * approve: aprova uma transação.
        * execute: executa a transação.

Um exemplo de utilização dessas classes encontra-se em App.tsx deste repositório.

## Links úteis

* Contratos da Gnosis e deploy utilizando Hardhat: https://github.com/gnosis/safe-contracts
* Biblioteca safe-core-sdk: https://github.com/gnosis/safe-core-sdk/tree/main/packages/safe-core-sdk 
* Template SDK (Safe App): https://github.com/gnosis/safe-apps-sdk/tree/master/packages/safe-apps-sdk
