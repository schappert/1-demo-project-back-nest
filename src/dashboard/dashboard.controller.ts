import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard) // protège toutes les routes de ce controller
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('/')
  async getDashboard(@Req() req: any) {
    // req.user provient de JwtStrategy.validate()
    const userId = req.user?.id || req.user?.sub;
    return this.dashboardService.getDashboardForUser(userId);
  }
}
