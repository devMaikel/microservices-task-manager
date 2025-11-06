import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserBasic } from './interfaces/user-basic.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'createdAt'],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.userRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found for deletion.`);
    }
  }

  async findAllWithDeleted(): Promise<User[]> {
    return this.userRepository.find({
      withDeleted: true,
    });
  }

  async findAllBasic(): Promise<UserBasic[]> {
    return this.userRepository.find({
      select: ['id', 'name', 'email'],
    });
  }
}
