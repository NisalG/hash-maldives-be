import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { User, UserDocument } from './entity/user.entity';
import { CreateUserDto } from './dto/create.dto';
import { EditUserDto } from './dto/edit.dto';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log('Creating new User ');

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Retrieving all Users');

    const users = await this.userModel.find().exec();

    this.logger.log(`Found ${users.length} Users`);

    return users;
  }

  async findOne(_id: string): Promise<User> {
    this.logger.log('Retrieving User  by Id');

    if (!mongoose.Types.ObjectId.isValid(_id)) return;

    return await this.userModel.findById(_id).exec();
  }

  async find(filter: object): Promise<User[]> {
    this.logger.log(`Retrieving User  by given column: ${filter}`);
    this.logger.debug('filter ', filter);
    return await this.userModel.find(filter).exec();
  }

  async update(id: string, editUserDto: EditUserDto) {
    this.logger.log('Updating User ');
    return await this.userModel.findByIdAndUpdate(id, editUserDto, {
      new: true,
    });
  }

  async remove(id: string) {
    this.logger.log('Removing User ');
    return await this.userModel.findByIdAndRemove(id);
  }
}
