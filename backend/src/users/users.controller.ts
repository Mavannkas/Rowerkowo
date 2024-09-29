import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request as ExpressRequest } from 'express';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('/route')
  addRoute(@Request() req: ExpressRequest, @Body() route: any) {
    return this.usersService.addRoute(req.userPayload.sub, route);
  }

  @Delete('/routes')
  deleteRoutes(@Request() req: ExpressRequest) {
    return this.usersService.clearRouteHistory(req.userPayload.sub);
  }

  @Delete('/route/:timestamp')
  deleteRouteByTimestamp(@Request() req: ExpressRequest, @Param('timestamp') timestamp: string) {
    return this.usersService.deleteRouteByTimestamp(req.userPayload.sub, timestamp);
  }
}
