import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserEntity,
  UserWithoutPassword,
  userToUserWithoutPassword,
} from './entities/user.entity';
import mongoose, { Model } from 'mongoose';
import { HashService } from 'src/helpers/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    @Inject(HashService) private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const hashedPsw = await this.hashService.hashPsw(createUserDto.password);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPsw,
    });
    const user = await newUser.save();
    return userToUserWithoutPassword(user);
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const allUsers: User[] = await this.userModel.find().exec();
    return allUsers.map((user) => userToUserWithoutPassword(user));
  }

  async findOne(id: string): Promise<UserWithoutPassword> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userToUserWithoutPassword(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.hashPsw(
        updateUserDto.password,
      );
    }

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userToUserWithoutPassword(user);
  }

  async remove(id: string) {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {};
  }

  async addRoute(id: mongoose.Types.ObjectId, directions: any) {
    const time = new Date().toISOString();
    const { routeHistory } = await this.userModel.findById(id) as User
    const updateDto = {
      routeHistory: [...routeHistory, { timeStamp: time, directions }]
    }
    const user = await this.userModel.findByIdAndUpdate(id, updateDto, {new: true});
    return userToUserWithoutPassword(user);
  }

  async clearRouteHistory(id: mongoose.Types.ObjectId) {
    const updateDto = {
      routeHistory: []
    }
    const user = await this.userModel.findByIdAndUpdate(id, updateDto, {new: true});
    return userToUserWithoutPassword(user);
  }

  async deleteRouteByTimestamp(id: mongoose.Types.ObjectId, timestamp: string) {
    const { routeHistory } = await this.userModel.findById(id) as User
    const updatedRouteHistory = routeHistory.filter(route => route.timeStamp !== timestamp)
    const updateDto = {
      routeHistory: updatedRouteHistory
    }
    const user = await this.userModel.findByIdAndUpdate(id, updateDto, {new: true});
    return userToUserWithoutPassword(user);
  }
}
