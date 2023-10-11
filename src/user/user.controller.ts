import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.dto';
import { EditUserDto } from './dto/edit.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserDto } from './dto/get.dto';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private logger: Logger,
  ) {}

  @Post()
  @ApiTags('user')
  @ApiOperation({ summary: 'Create User' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: CreateUserDto,
  })
  @HttpCode(HttpStatus.BAD_REQUEST)
  @ApiBadRequestResponse({
    description: 'Invalid User Data!',
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto, @Req() request: Request) {
    this.logger.debug(request);
    this.logger.log(`Handling a new User Creating request`);

    this.logger.debug('createUserDto: ', createUserDto);
    // Find existing  with same name
    const existing = await this.userService.find({
      user: createUserDto.email,
    });
    this.logger.debug('existing ', existing);
    // Handle 409 if  found
    if (existing && existing.length > 0) {
      throw new ConflictException('User Already Available!');
    }

    createUserDto._id = new Types.ObjectId().toHexString();

    // Create
    const user = await this.userService.create(createUserDto);

    this.logger.log(`User created with id ${user.id}`);

    // Return 201 Created
    return {
      message: 'User created successfully',
      user,
    };
  }

  @Get()
  @ApiTags('user')
  @ApiOperation({ summary: 'Get All Users' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'List all Users',
    type: GetUserDto,
    isArray: true,
  })
  async findAll(@Req() request: Request) {
    this.logger.debug(request.headers);
    this.logger.log('Handling findAll Users request');

    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiTags('user')
  @ApiOperation({ summary: 'Find user by ID' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'The record has been successfully found.' })
  @HttpCode(HttpStatus.NOT_FOUND)
  @ApiNotFoundResponse({ description: 'The record could not be found.' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ type: GetUserDto })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Handling findOne User request`);

    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('Expnse Not Found!');
    }
    return user;
  }

  @Patch(':id')
  @ApiTags('user')
  @ApiOperation({ summary: 'Update User' })
  @ApiBody({ type: EditUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: EditUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: EditUserDto) {
    this.logger.log(`Handling User Updating request`);

    // Find User  by id
    const existingUser = await this.userService.findOne(id);

    if (!existingUser) {
      throw new NotFoundException('User Not Found!'); // 404
    }

    // Update User
    const user = await this.userService.update(id, updateUserDto);

    // return 200 updated
    return {
      message: 'User updated successfully',
      user,
    };
  }

  @Delete(':id')
  @ApiTags('user')
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
    type: EditUserDto,
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Handling User Deleting request`);

    // Find  by id
    const userToDelete = await this.userService.findOne(id);

    // Handle 404 if not found
    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    // Delete
    const user = await this.userService.remove(id);

    // Return 200
    return {
      message: 'User deleted successfully',
      user,
    };
  }
}
