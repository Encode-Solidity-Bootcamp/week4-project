import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ethers, providers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import { PaymentOrder } from './models/paymentOrder.model';

const CONTRACT_ADDRESS = '0xd3Cc4Bfffa1ED08ba512E6a0f534857e09529Fd9';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;

  paymentOrders: PaymentOrder[];

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      tokenJson.abi,
      this.provider,
    );
    this.paymentOrders = [];
    console.log('construct success!');
  }

  getContractAddress(): string {
    return this.contract.address;
  }
  async getTotalSupply(): Promise<number> {
    const totalSupplyBN = await this.contract.totalSupply();
    const totalSupplyString = ethers.utils.formatEther(totalSupplyBN);
    const totalSupplyNumber = parseFloat(totalSupplyString);
    return totalSupplyNumber;
  }

  async getAllowance(from: string, to: string): Promise<number> {
    const allowanceBN = await this.contract.allowance(from, to);
    const allowanceString = ethers.utils.formatEther(allowanceBN);
    const allowanceNumber = parseFloat(allowanceString);
    return allowanceNumber;
  }
  async getTransactionStatus(hash: string): Promise<string> {
    const tx = await this.provider.getTransaction(hash);
    const txReceipt = await tx.wait();
    return txReceipt.status == 1 ? 'Completed' : 'Reverted';
  }

  getPaymentOrders() {
    return this.paymentOrders;
  }
  createPaymentOrder(value: number, secret: string) {
    const newPaymentOrder = new PaymentOrder();
    newPaymentOrder.value = value;
    newPaymentOrder.secret = secret;
    newPaymentOrder.id = this.paymentOrders.length;

    this.paymentOrders.push(newPaymentOrder);
    return newPaymentOrder.id;
  }

  // async fulfillPaymentOrder(id: number, secret: string, address: string){
  //   const paymentOrder = this.paymentOrders.find((p) => p.id === id);

  //   if (!paymentOrder){
  //     throw new NotFoundException('Payment order not found ');
  //   }

  //   if (paymentOrder.secret !== secret){
  //     throw new ForbiddenException('Invalid Secret');
  //   }
  //   const privateKey = this.configService.get<string>('PRIVATE_KEY');

  //   if (!privateKey) {
  //     throw new InternalServerErrorException('Wrong server configuration');
  //   }
  //   const signer = new ethers.Wallet(privateKey, this.provider);

  //   const tx = await this.contract
  //     .connect(signer)
  //     .mint(address, ethers.utils.parseEther(paymentOrder.value.toString()));
  //   const txReceipt = await tx.wait();

  //   console.log(txReceipt);
  // }
  //TODO check if the secret is correct
  //pick the pkey from env
  //Build a signer
  //Connect signer to the contract
  //call the Mint function passing value to mint to address
}
