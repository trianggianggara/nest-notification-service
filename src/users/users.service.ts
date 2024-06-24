import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ProducerService } from 'src/queues/producer.file';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private producerService: ProducerService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);
    const emailData = {
      email: user.email,
      subject: 'Welcome to Our Community',
      html: `<p>Hello ${user.username},</p>
        <p>Welcome to our community! Your account is now active.</p>
        <p>Enjoy your time with us!</p>`,
    };
    await this.producerService.addToEmailQueue(emailData);
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
