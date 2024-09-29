import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Request as ExpressRequest } from 'express';
import { RouteDto } from './dto/routeDto';
import { RouteSharingService } from './route-sharing.service';

@Controller('route-sharing')
export class RouteSharingController {

  constructor(private routeSharingService: RouteSharingService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.Admin, UserRole.User)
  shareRoute(
    @Request() req: ExpressRequest,
    @Body() routeDto: RouteDto,
  ) {
    return this.routeSharingService.shareRoute(routeDto, req.userPayload);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.Admin, UserRole.User)
  getRoutes() {
    return this.routeSharingService.getRoutes();
  }
}
