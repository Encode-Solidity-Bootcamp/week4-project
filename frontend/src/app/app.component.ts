import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { BigNumber, Contract, Wallet, ethers, utils } from "ethers";
import tokenJson from "../assets/MyToken.json";
import ballotJson from "../assets/Ballot.json";

const API_URL = "http://localhost:3000/contract-address";
const API_URL_MINT = "http://localhost:3000/request-tokens";
const { ethereum } = window;
const BALLOT_ADDRESS = "0xCd1f4c54c728F0AF2B6cC757a8b397Ae516BE93b";
const VoteAmount = 1;
interface Candidate {
  value: number;
  viewValue: string;
}
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  proposalIndex: number | undefined;
  candidates: Candidate[] = [
    { value: 0, viewValue: "David" },
    { value: 1, viewValue: "Boma" },
    { value: 2, viewValue: "Leo" },
  ];
  blockNumber: number | string | undefined = 0;
  userWallet: Wallet | undefined;
  address: string | undefined;
  balance: number | undefined;
  userEthBalance: number | undefined;
  userTokenBalance: number | undefined;
  tokenContractAddress: string | undefined;
  ballotContractAddress: string | undefined;
  tokenContract: Contract | undefined;
  tokenTotalSupply: string | number | undefined;
  delegated: boolean | undefined;
  startLoading: boolean | undefined;

  constructor(private http: HttpClient) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    this.getTokenAddress().subscribe((response) => {
      this.tokenContractAddress = response.address;
      this.tokenContract = new Contract(
        this.tokenContractAddress,
        tokenJson.abi,
        signer
      );
    });
  }
  getTokenAddress() {
    return this.http.get<{ address: string }>(API_URL);
  }

  updateTokenInfo() {
    if (!this.tokenContractAddress) return;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    this.tokenContract = new Contract(
      this.tokenContractAddress,
      tokenJson.abi,
      signer
    );
    this.tokenTotalSupply = "...";
    this.tokenContract["totalSupply"]().then((totalSupplyBN: BigNumber) => {
      const totalSupplyStr = utils.formatEther(totalSupplyBN);
      this.tokenTotalSupply = parseInt(totalSupplyStr);
    });
  }

  async connectWallet() {
    try {
      if (!ethereum) {
        alert("Please make sure Metamask is Installed");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(ethereum);

      const balance = await provider.getBalance(accounts[0]);
      const balanceStr = utils.formatEther(balance);
      this.balance = parseFloat(balanceStr);

      this.address = accounts[0];

      this.getTokenBalance();

      console.log(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }
  async getTokenBalance() {
    if (!this.tokenContract) return;
    const tokenBalance = await this.tokenContract["balanceOf"](this.address);
    const tokenBalanceStr = utils.formatEther(tokenBalance);
    this.userTokenBalance = parseFloat(tokenBalanceStr);
  }

  requestTokens(amount: string) {
    const body = {
      address: this.userWallet?.address,
      amount: amount,
    };
    this.http
      .post<{ result: string }>(API_URL_MINT, body)
      .subscribe((result) => {
        console.log(`Requested: : ` + amount);
        console.log(`Transaction Hash: ` + result.result);
      });
  }

  async selfDelegate() {
    try {
      if (!this.tokenContractAddress) return;
      else if (!this.address) {
        this.connectWallet();
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      this.startLoading = true;

      this.tokenContract = new Contract(
        this.tokenContractAddress,
        tokenJson.abi,
        signer
      );
      await this.tokenContract["delegate"](this.address).then(
        (transactionHash: string) => {
          console.log(transactionHash);
        }
      );
      this.startLoading = false;
      this.delegated = true;
    } catch (err) {
      console.log(err);
    }
  }
  getIndex(value: number) {
    this.proposalIndex = value;
    console.log(this.proposalIndex);
  }

  async castVote(candidateIndex: number) {
    alert(this.proposalIndex);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractInstance = new Contract(
      BALLOT_ADDRESS,
      ballotJson.abi,
      signer
    );
    const transactionResponse = await contractInstance["vote"](
      candidateIndex,
      VoteAmount
    );
  }
}
