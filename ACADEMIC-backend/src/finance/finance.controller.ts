import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../shared/enums/user-role.enum';

@Controller('finance')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) { }

  @Post('catalog')
  @Roles(UserRole.ADMIN)
  createConcept(@Body() body: any, @Request() req) {
    const schoolId = req.user.schoolId;
    return this.financeService.createConcept(body, schoolId);
  }

  @Get('catalog')
  getMenu(@Request() req) {
    return this.financeService.findAll(req.user.schoolId);
  }

  @Get('student-history/:studentId')
  @Roles(UserRole.ALUMNO, UserRole.ADMIN)
  getHistory(@Param('studentId') studentId: string) {
    return this.financeService.getStudentPaymentHistory(studentId);
  }

  @Get('student-pending/:studentId')
  @Roles(UserRole.ALUMNO, UserRole.ADMIN)
  getPending(@Param('studentId') studentId: string) {
    return this.financeService.getStudentPendingPayments(studentId);
  }

  @Get('student-catalog-list')
  @Roles(UserRole.ALUMNO)
  getCatalogList(@Request() req) {
    return this.financeService.getCatalogNames(req.user.schoolId);
  }
}