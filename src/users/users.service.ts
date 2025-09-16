import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // Retourne tous les utilisateurs
  async findAll(): Promise<User[]> {
    return await this.repo.find();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.repo.findOne({ where: { id } });
  }

  // Création d’un utilisateur avec hash du mot de passe
  async create(
    name: string,
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ name, username, email, password: hashed });
    return await this.repo.save(user);
  }

  // Mise à jour partielle d’un utilisateur
  async update(
    id: number,
    attrs: Partial<Pick<User, 'name' | 'email' | 'username' | 'password'>>,
  ): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (attrs.password) {
      attrs.password = await bcrypt.hash(attrs.password, 10);
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  // Suppression d’un utilisateur
  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
