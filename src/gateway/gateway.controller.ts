import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GatewayService } from './gateway.service';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // Member APIs
  @Get('member/list')
  async getAllMembers() {
    return this.gatewayService.getAll();
  }

  @Get('member/:id')
  async getMemberById(@Param('id') id: string) {
    return this.gatewayService.getById(id);
  }

  @Get('member/phone/:phone')
  async getMemberByPhone(@Param('phone') phone: string) {
    return this.gatewayService.getByPhone(phone);
  }

  @Get('member/:id/balance')
  async getMemberBalance(@Param('id') id: string) {
    return this.gatewayService.getBalance(id);
  }

  @Post('member/create')
  async createMember(@Body() createMemberDto: any) {
    return this.gatewayService.createMember(createMemberDto);
  }

  @Put('member/:id')
  async updateMember(@Param('id') id: string, @Body() updateMemberDto: any) {
    return this.gatewayService.updateMember(id, updateMemberDto);
  }

  @Delete('member/:id')
  async deleteMember(@Param('id') id: string) {
    return this.gatewayService.deleteMember(id);
  }

  // Bank and Data APIs
  @Get('bank/lao/list')
  async getLaoBanks() {
    return this.gatewayService.getLaoBanks();
  }

  @Get('currency/list')
  async getCurrencies() {
    return this.gatewayService.getCurrencies();
  }

  @Get('customer-group/list')
  async getCustomerGroups() {
    return this.gatewayService.getCustomerGroups();
  }

  // Verification APIs
  @Post('member/check-account')
  async checkAccount(@Body() checkAccountDto: any) {
    return this.gatewayService.checkAccount(checkAccountDto);
  }

  @Post('member/verify-bank-account')
  async verifyBankAccount(@Body() verifyBankAccountDto: any) {
    return this.gatewayService.verifyBankAccount(verifyBankAccountDto);
  }

  // Health Check
  @Get('health')
  async healthCheck() {
    return this.gatewayService.healthCheck();
  }

  // Credit Management APIs
  @Post('/api/member/:id/add-credit')
  async addCredit(@Param('id') id: string, @Body() addCreditDto: any) {
    return this.gatewayService.addCredit(id, addCreditDto);
  }

  @Post('/api/member/:id/remove-credit')
  async removeCredit(@Param('id') id: string, @Body() removeCreditDto: any) {
    return this.gatewayService.removeCredit(id, removeCreditDto);
  }

  @Post('/api/member/:id/cashout-credit')
  async cashoutCredit(@Param('id') id: string, @Body() cashoutCreditDto: any) {
    return this.gatewayService.cashoutCredit(id, cashoutCreditDto);
  }

  @Post('/api/member/deposit')
  async deposit(@Body() depositDto: any) {
    return this.gatewayService.deposit(depositDto);
  }
}
