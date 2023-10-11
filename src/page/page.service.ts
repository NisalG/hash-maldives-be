import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Page, PageDocument } from './entity/page.entity';
import { CreatePageDto } from './dto/create.dto';
import { EditPageDto } from './dto/edit.dto';

@Injectable()
export class PageService {
  private logger = new Logger('PageService');

  constructor(
    @InjectModel(Page.name)
    private pageModel: Model<PageDocument>,
  ) {}

  async create(createPageDto: CreatePageDto) {
    this.logger.log('Creating new Page ');

    const createdPage = new this.pageModel(createPageDto);
    return createdPage.save();
  }

  async findAll(): Promise<Page[]> {
    this.logger.log('Retrieving all Pages');

    const pages = await this.pageModel.find().exec();

    this.logger.log(`Found ${pages.length} Pages`);

    return pages;
  }

  async findOne(_id: string): Promise<Page> {
    this.logger.log('Retrieving Page  by Id');

    if (!mongoose.Types.ObjectId.isValid(_id)) return;

    return await this.pageModel.findById(_id).exec();
  }

  async find(filter: object): Promise<Page[]> {
    this.logger.log(`Retrieving Page by given column: ${filter}`);
    this.logger.debug('filter ', filter);
    return await this.pageModel.find(filter).exec();
  }

  async update(id: string, updatePageDto: EditPageDto) {
    this.logger.log('Updating Page');
    return await this.pageModel.findByIdAndUpdate(id, updatePageDto, {
      new: true,
    });
  }

  async remove(id: string) {
    this.logger.log('Removing Page ');
    return await this.pageModel.findByIdAndRemove(id);
  }
}
