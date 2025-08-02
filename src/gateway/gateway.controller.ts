import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GatewayService } from './gateway.service';

@Controller('api')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('member/list')
  @UseGuards(JwtAuthGuard)
  async getAll(@Req() req) {
    // ดึง token จาก request
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.gatewayService.getAll(token);
  }
}
