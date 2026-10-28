import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UsersService } from '../users/users.service.js';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private userService: UsersService) { }

  @Get('users')
  @ApiOperation({ summary: 'List all users - admin only' })
  findAll() {
    return this.userService.findAll();
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }

}
