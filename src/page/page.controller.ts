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

import { PageService } from './page.service';
import { CreatePageDto } from './dto/create.dto';
import { EditPageDto } from './dto/edit.dto';
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
import { GetPageDto } from './dto/get.dto';
import { Types } from 'mongoose';

@Controller('page')
export class PageController {
  constructor(
    private readonly pageService: PageService,
    private logger: Logger,
  ) {}

  @Post()
  @ApiTags('page')
  @ApiOperation({ summary: 'Create Page' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Page created successfully.',
    type: CreatePageDto,
  })
  @HttpCode(HttpStatus.BAD_REQUEST)
  @ApiBadRequestResponse({
    description: 'Invalid Page Data!',
  })
  @ApiBody({ type: CreatePageDto })
  async create(@Body() createPageDto: CreatePageDto, @Req() request: Request) {
    this.logger.debug(request);
    this.logger.log(`Handling a new Page Creating request`);
    this.logger.debug('createPageDto: ', createPageDto);
    // Find existing  with same title
    const existing = await this.pageService.find({
      page: createPageDto.title,
    });
    this.logger.debug('existing ', existing);
    // Handle 409 if  found
    if (existing && existing.length > 0) {
      throw new ConflictException('Page Already Available!');
    }

    createPageDto._id = new Types.ObjectId().toHexString();

    // Create
    const page = await this.pageService.create(createPageDto);

    this.logger.log(`Page created with id ${page.id}`);

    // Another way of returnning
    // return response.status(HttpStatus.CREATED).json({
    //   page,
    // });

    // Return 201 Created
    return {
      message: 'Page created successfully',
      page,
    };
  }

  @Get()
  @ApiTags('page')
  @ApiOperation({ summary: 'Get All Pages' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'List all Pages',
    type: GetPageDto,
    isArray: true,
  })
  async findAll(@Req() request: Request) {
    this.logger.debug(request.headers);
    this.logger.log('Handling findAll Pages request');

    return await this.pageService.findAll();
  }

  @Get(':id')
  @ApiTags('page')
  @ApiOperation({ summary: 'Find page by ID' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'The record has been successfully found.' })
  @HttpCode(HttpStatus.NOT_FOUND)
  @ApiNotFoundResponse({ description: 'The record could not be found.' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ type: GetPageDto })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Handling findOne Page request`);

    const page = await this.pageService.findOne(id);
    if (!page) {
      throw new NotFoundException('Expnse Not Found!');
    }
    return page;
  }

  @Patch(':id')
  @ApiTags('page')
  @ApiOperation({ summary: 'Update Page' })
  @ApiBody({ type: EditPageDto })
  @ApiResponse({
    status: 200,
    description: 'Page updated successfully.',
    type: EditPageDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Page not found.',
  })
  async update(@Param('id') id: string, @Body() updatePageDto: EditPageDto) {
    this.logger.log(`Handling Page Updating request`);

    // Find Page  by id
    const existingPage = await this.pageService.findOne(id);

    if (!existingPage) {
      throw new NotFoundException('Page Not Found!'); // 404
    }

    // Update Page
    const page = await this.pageService.update(id, updatePageDto);

    // return 200 updated
    return {
      message: 'Page updated successfully',
      page,
    };
  }

  @Delete(':id')
  @ApiTags('page')
  @ApiResponse({
    status: 404,
    description: 'Page not found.',
  })
  @ApiResponse({
    status: 200,
    description: 'Page deleted successfully.',
    type: EditPageDto,
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Handling Page Deleting request`);

    // Find  by id
    const pageToDelete = await this.pageService.findOne(id);

    // Handle 404 if not found
    if (!pageToDelete) {
      throw new NotFoundException('Page not found');
    }

    // Delete
    const page = await this.pageService.remove(id);

    // Return 200
    return {
      message: 'Page deleted successfully',
      page,
    };
  }
}
