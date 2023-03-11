import { Component } from '@angular/core';
import { ethers, utils, Wallet } from 'ethers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  blockNumber: number | string | undefined ; 
  provider: ethers.providers.BaseProvider;
  userWallet: Wallet | undefined;
  userEthBalance: number | undefined;
  

  constructor(){
    this.provider = ethers.getDefaultProvider('goerli');
  }

  syncBlock(){
    this.blockNumber = "loading...";
    this.provider.getBlock('latest').then((block) => {
      this.blockNumber = block.number;
  });
}
clearBlock(){
  this.blockNumber = 0;
}

createWallet(){
  this.userWallet = Wallet.createRandom().connect(this.provider);
  this.userWallet.getBalance().then((balanceBN) => {
    const balanceStr = utils.formatEther(balanceBN);
    this.userEthBalance = parseFloat(balanceStr);
  });
}
}

