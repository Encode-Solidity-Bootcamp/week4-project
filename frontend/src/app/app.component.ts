import { Component } from '@angular/core';
import {ethers} from 'ethers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  blockNumber: number | string | undefined ; 
  provider: ethers.providers.BaseProvider;
  

  constructor(){
    this.provider = ethers.getDefaultProvider('goerli');
  }

  syncBlock(){
    this.blockNumber = "loading..."
    this.provider.getBlock('latest').then((block) => {
      this.blockNumber = block.number;
  });
}
clearBlock(){
  this.blockNumber = 0;
}
}

