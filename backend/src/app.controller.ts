import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('contract-address')
  getContractAddress(): string {
    return this.appService.getContractAddress();
  }

  @Get('total-supply')
  async getTotalSupply(): Promise<number> {
    return this.appService.getTotalSupply();
  }
  @Get('allowance/:from/:to')
  async getAllowance(
    @Param('from') from: string,
    @Param('from') to: string,
  ): Promise<number> {
    return await this.appService.getAllowance(from, to);
  }

  @Get('transaction-status')
  async getTransactionStatus(
    @Query('hash')
    hash: string,
  ): Promise<string> {
    return await this.appService.getTransactionStatus(hash);
  }
}
