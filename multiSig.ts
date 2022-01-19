import Safe from '@gnosis.pm/safe-core-sdk';
import { SafeFactory, EthersAdapter, ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk';
import { SafeTransactionDataPartial, SafeTransaction } from '@gnosis.pm/safe-core-sdk-types';
import { ethers } from 'ethers';

declare global {
  interface Window {
      ethereum:any;
  }
}

const provider = new ethers.providers.Web3Provider(window.ethereum);

export class Factory {

    private contractNetworks: ContractNetworksConfig;
    private ethAdapter: EthersAdapter;

    constructor(id: string, multiSendAddress: string, safeMasterCopyAddress: string, safeProxyFactoryAddress: string){
        this.connect();
        this.ethAdapter = new EthersAdapter({
            ethers,
            signer: provider.getSigner(0)
        })
        this.contractNetworks = {[id]: {
            multiSendAddress: multiSendAddress,
            safeMasterCopyAddress: safeMasterCopyAddress,
            safeProxyFactoryAddress: safeProxyFactoryAddress
        } }
    }
      
    private async connect(): Promise<void>{
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    public async createWallet(owners: string[], threshold: number): Promise<Safe>{
        const safeFactory = await SafeFactory.create({ ethAdapter: this.ethAdapter, contractNetworks: this.contractNetworks});
        return await safeFactory.deploySafe({ owners, threshold });
    }

    public defineContract(address: string, abi: ethers.ContractInterface): ContractMS{
        return new ContractMS(address, abi, this);
    }

    public getContractNetworks(): ContractNetworksConfig{
        return this.contractNetworks;
    }
}

class ContractMS { 
    
    private contract: ethers.Contract;
    private factory: Factory;

    constructor(address: string, abi: ethers.ContractInterface, factory: Factory){
        this.contract = new ethers.Contract(address, abi, provider);
        this.factory = factory;
    }
    
    public async createTransaction(wallet: Safe, methodName: string, params?: readonly any[]): Promise<TxContractMS>{
        const transaction: SafeTransactionDataPartial[] = [{
            to: this.contract.address,
            value: '0',
            data: this.contract.interface.encodeFunctionData(methodName, params),
            safeTxGas: 220000
        }]
        return new TxContractMS(await wallet.createTransaction(transaction), wallet, this.factory);
    }   

    public getAddress(): string{
        return this.contract.address;
    }
}

export class TxContractMS {
    private transaction: SafeTransaction;
    private carteira: Safe;
    private factory: Factory;

    constructor(transaction: SafeTransaction, carteira: Safe, factory: Factory){
        this.transaction = transaction;
        this.carteira = carteira;
        this.factory = factory;
    }

    private async connect(): Promise<Safe>{
        const ethAdapterOwner = new EthersAdapter({ ethers, signer: provider.getSigner(0) })
        return this.carteira.connect({ ethAdapter: ethAdapterOwner, safeAddress: this.carteira.getAddress(), contractNetworks: this.factory.getContractNetworks()})
    }

    public async approve(): Promise<void>{
        const safeSdk = await this.connect();
        const txHash = await safeSdk.getTransactionHash(this.transaction)
        const approveTxResponse = await safeSdk.approveTransactionHash(txHash)
        await approveTxResponse.transactionResponse?.wait()
    }

    public async execute(): Promise<void>{
        const safeSdk = await this.connect();
        const options = {
            gasLimit: 220000,
        }
        const executeTxResponse = await safeSdk.executeTransaction(this.transaction, options)
        await executeTxResponse.transactionResponse?.wait()
    }    
}
