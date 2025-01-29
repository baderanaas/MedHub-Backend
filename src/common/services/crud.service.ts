// src/common/services/crud.service.ts
import { DeepPartial, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CrudService<T> {
  constructor(private readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  // async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T> {
  //   await this.repository.update(id, data);
  //   return this.repository.findOne({where:{id:id}});
  // }

  async delete(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
  }
}
