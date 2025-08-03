import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { prisma } from '../lib/prisma';

@Injectable()
export class GatewayService {
  // Helper function to get JWT token from backoffice
  private async getJwtToken(targetDomain: string): Promise<string> {
    try {
      const loginResponse = await axios.post(
        `${targetDomain}/api/auth/signin`,
        {
          username: 'admin',
          password: 'Admin123',
        },
      );

      if (loginResponse.data && loginResponse.data.data) {
        return loginResponse.data.data;
      }
      return '';
    } catch (error) {
      console.error('Failed to get JWT token:', error);
      return '';
    }
  }

  // Existing methods
  async getAll() {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });

      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const response = await axios.get(
        `${tokenRecord.targetDomain}/api/member/list`,
      );

      return {
        success: true,
        data: response.data,
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to fetch members from backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(id: string) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });

      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const response = await axios.get(
        `${tokenRecord.targetDomain}/api/member/list`,
      );
      const members = response.data.data.members;
      const member = members.find((m) => m.id === id);

      if (!member) {
        throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: { member },
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to fetch member by ID from backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getByPhone(phone: string) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });

      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const response = await axios.get(
        `${tokenRecord.targetDomain}/api/member/list`,
      );
      const members = response.data.data.members;
      const member = members.find((m) => m.username === phone);

      if (!member) {
        throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: { member },
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to fetch member by phone from backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBalance(id: string) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });

      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const response = await axios.get(
        `${tokenRecord.targetDomain}/api/member/list`,
      );
      const members = response.data.data.members;
      const member = members.find((m) => m.id === id);

      if (!member) {
        throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: {
          memberId: id,
          balance: parseFloat(member.creditBalance || '0'),
          member,
        },
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to fetch member balance from backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // New methods for CRUD operations
  async createMember(createMemberDto: any) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });

      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Get JWT token using helper function
      const jwtToken = await this.getJwtToken(tokenRecord.targetDomain);

      const response = await axios.post(
        `${tokenRecord.targetDomain}/api/member/create-member`,
        createMemberDto,
        {
          headers: {
            Cookie: `token=${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        success: true,
        data: response.data,
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to create member in backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateMember(id: string, updateMemberDto: any) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });

      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const response = await axios.put(
        `${tokenRecord.targetDomain}/api/member/${id}`,
        updateMemberDto,
      );

      return {
        success: true,
        data: response.data,
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to update member in backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteMember(id: string) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });

      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const response = await axios.delete(
        `${tokenRecord.targetDomain}/api/member/${id}`,
      );

      return {
        success: true,
        data: { success: true },
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to delete member in backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Credit Management Methods
  async addCredit(id: string, addCreditDto: any) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });
      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const jwtToken = await this.getJwtToken(tokenRecord.targetDomain);
      const response = await axios.post(
        `${tokenRecord.targetDomain}/api/member/add-remove-credit-member`,
        {
          phone: addCreditDto.phone,
          amount: addCreditDto.amount,
          creditType: 'ADD_CREDIT',
          remarks: addCreditDto.remarks || 'Add credit via Bank Adapter',
        },
        {
          headers: {
            Cookie: `token=${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        success: true,
        data: response.data,
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new HttpException(
        {
          error: 'Failed to add credit in backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeCredit(id: string, removeCreditDto: any) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });
      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const jwtToken = await this.getJwtToken(tokenRecord.targetDomain);
      const response = await axios.post(
        `${tokenRecord.targetDomain}/api/member/remove-credit-member`,
        {
          id: id,
          amount: removeCreditDto.amount,
          remarks: removeCreditDto.remarks || 'Remove credit via Bank Adapter',
        },
        {
          headers: {
            Cookie: `token=${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        success: true,
        data: response.data,
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new HttpException(
        {
          error: 'Failed to remove credit in backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cashoutCredit(id: string, cashoutCreditDto: any) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });
      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const jwtToken = await this.getJwtToken(tokenRecord.targetDomain);
      const response = await axios.post(
        `${tokenRecord.targetDomain}/api/member/cashout-credit-member`,
        {
          id: id,
          remarks:
            cashoutCreditDto.remarks || 'Cashout credit via Bank Adapter',
        },
        {
          headers: {
            Cookie: `token=${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        success: true,
        data: response.data,
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new HttpException(
        {
          error: 'Failed to cashout credit in backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deposit(depositDto: any) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });
      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const jwtToken = await this.getJwtToken(tokenRecord.targetDomain);
      const response = await axios.post(
        `${tokenRecord.targetDomain}/api/dashboard/deposit`,
        {
          Id: depositDto.id || '',
          Phone: depositDto.phone,
          MoneyDeposit: depositDto.amount,
          Currency: depositDto.currency,
          BankName: depositDto.bankName,
          DateDeposit: depositDto.dateDeposit,
          TimeDeposit: depositDto.timeDeposit,
          ActualDateTime: depositDto.actualDateTime,
        },
        {
          headers: {
            Cookie: `token=${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        success: true,
        data: response.data,
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new HttpException(
        {
          error: 'Failed to deposit in backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Bank and data APIs
  async getLaoBanks() {
    const banks = [
      { value: 'BCEL', label: 'BCEL BANK (BCEL)' },
      { value: 'JDB', label: 'JOINT DEVELOPMENT BANK (JDB)' },
      { value: 'LDB', label: 'LAO DEVELOPMENT BANK (LDB)' },
      { value: 'LVB', label: 'LAOS-VIETNAM BANK (LVB)' },
      { value: 'ACLB', label: 'ACLEDA BANK LAO (ACLB)' },
      { value: 'APB', label: 'AGRICULTURAL PROMOTION BANK (APB)' },
      { value: 'BIC', label: 'BIC Bank Lao Co. Ltd. (BIC)' },
      { value: 'BOC', label: 'Bank of China (Hong Kong) Ltd (BOC)' },
      {
        value: 'ICBC',
        label: 'Industrial and Commercial Bank of China Ltd (ICBC)',
      },
      { value: 'IDCB', label: 'INDOCHINA BANK LTD (IDCB)' },
      { value: 'KTB', label: 'KASIKORNTHAI Bank Sole Ltd. (KTB)' },
      { value: 'MRB', label: 'MARUHAN Japan Bank Lao Co., Ltd (MRB)' },
      { value: 'MBB', label: 'Military Commercial Joint Stock Ban (MBB)' },
      { value: 'PBB', label: 'Public Bank Lao Ltd. (PBB)' },
      { value: 'SCB', label: 'SACOMBANK LAO (SCB)' },
      { value: 'STB', label: 'ST Bank Ltd. (STB)' },
      { value: 'VTB', label: 'Vietinbank Lao Ltd. (VTB)' },
      { value: 'BFL', label: 'Banque Franco-Lao Ltd. (BFL)' },
      { value: 'PSV', label: 'PHONGSAVANH BANK LTD (PSV)' },
    ];

    return {
      success: true,
      data: banks,
      timestamp: new Date().toISOString(),
    };
  }

  async getCurrencies() {
    const currencies = [
      { value: 'LAK', label: 'LAK' },
      { value: 'THB', label: 'THB' },
    ];

    return {
      success: true,
      data: currencies,
      timestamp: new Date().toISOString(),
    };
  }

  async getCustomerGroups() {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });

      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Get JWT token using helper function
      const jwtToken = await this.getJwtToken(tokenRecord.targetDomain);

      const response = await axios.get(
        `${tokenRecord.targetDomain}/api/bank/bcel/get-bank`,
        {
          headers: {
            Cookie: `token=${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        success: true,
        data: response.data,
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to fetch customer groups from backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Verification APIs
  async checkAccount(checkAccountDto: any) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });

      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Get JWT token using helper function
      const jwtToken = await this.getJwtToken(tokenRecord.targetDomain);

      const response = await axios.post(
        `${tokenRecord.targetDomain}/api/member/check-account-name`,
        checkAccountDto,
        {
          headers: {
            Cookie: `token=${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        success: true,
        data: response.data,
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to check account in backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyBankAccount(verifyBankAccountDto: any) {
    try {
      const tokenRecord = await prisma.token.findFirst({
        where: { isActive: true },
      });

      if (!tokenRecord) {
        throw new HttpException(
          'No active token found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Get JWT token using helper function
      const jwtToken = await this.getJwtToken(tokenRecord.targetDomain);

      const response = await axios.post(
        `${tokenRecord.targetDomain}/api/member/check-account-name`,
        verifyBankAccountDto,
        {
          headers: {
            Cookie: `token=${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        success: true,
        data: response.data,
        prefix: tokenRecord.prefix,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to verify bank account in backoffice',
          statusCode: 500,
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Health Check
  async healthCheck() {
    return {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'bank-adapter',
      },
    };
  }
}
