import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma';

@Injectable()
export class GatewayService {
  async getAll(token: string) {
    // 1. ตรวจสอบ token และดึงข้อมูล
    const tokenRecord = await prisma.token.findFirst({
      where: {
        tokenHash: token,
        isActive: true,
      },
    });

    if (!tokenRecord) {
      return {
        error: 'Invalid token',
        statusCode: 401,
      };
    }

    // 2. แสดงข้อมูลจาก token
    return {
      message: 'Get all members - Token info',
      tokenInfo: {
        clientId: tokenRecord.clientId,
        targetDomain: tokenRecord.targetDomain,
        prefix: tokenRecord.prefix,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
