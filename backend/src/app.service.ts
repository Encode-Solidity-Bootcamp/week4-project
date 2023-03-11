import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ethers, providers,utils } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/TokenBallot.json';

const CONTRACT_ADDRESS = '0xd3Cc4Bfffa1ED08ba512E6a0f534857e09529Fd9';
const BALLOT_CONTRACT_ADDRESS = '0xCd1f4c54c728F0AF2B6cC757a8b397Ae516BE93b'

@Injectable()
export class AppService {
  
  provider: ethers.providers.Provider;
  contract: ethers.Contract;
  tokenBallot: ethers.Contract;

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      tokenJson.abi,
      this.provider,
    );
    this.tokenBallot = new ethers.Contract(
      BALLOT_CONTRACT_ADDRESS,
      ballotJson.abi,
      this.provider,
    );
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

  async winningVote(): Promise<string> {
    const winnerName = await this.tokenBallot.winnerName();
    const  winner = utils.parseBytes32String(winnerName);
    return winner;
  }

  requestTokens(address: string, amount: number){

    //load pkey from .env
    // create signer
    // connect the signer
    // call the mint function
    return "tx hash"
    throw new Error('Method not implemented.');
  }

  
}
