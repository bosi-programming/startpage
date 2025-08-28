import type { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export class BaseModel<T extends ObjectLiteral> {
  repository;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  public async create(
    props: Omit<T, 'id'>,
  ): Promise<[{ errorCode: number; errorMessage: string } | null, T | null]> {
    try {
      const newEntry = this.repository.create(props as T);
      await this.repository.save(newEntry);
      return [null, newEntry];
    } catch {
      return [{ errorCode: 500, errorMessage: 'Server error' }, null];
    }
  }

  public async getById(
    id: number,
  ): Promise<[{ errorCode: number; errorMessage: string }, null] | [null, T]> {
    try {
      const entity = await this.repository.findOneBy({
        id,
      } as unknown as FindOptionsWhere<T>);
      if (!entity) {
        return [{ errorCode: 400, errorMessage: 'Entity not found' }, null];
      }
      return [null, entity];
    } catch {
      return [{ errorCode: 500, errorMessage: 'Server error' }, null];
    }
  }

  public async put(
    props: T,
  ): Promise<[{ errorCode: number; errorMessage: string } | null, T | null]> {
    try {
      const entity = await this.repository.findOneBy({ id: props.id });
      if (!entity) {
        return [{ errorCode: 400, errorMessage: 'Entity not found' }, null];
      }
      await this.repository.save(props);
      const newEntity = await this.repository.findOneBy({ id: props.id });
      return [null, newEntity];
    } catch (e) {
      console.error(e);
      return [{ errorCode: 500, errorMessage: 'Server error' }, null];
    }
  }

  public async delete(
    id: T['id'],
  ): Promise<[{ errorCode: number; errorMessage: string } | null, T | null]> {
    try {
      const entity = await this.repository.findOneBy({ id });
      if (!entity) {
        return [{ errorCode: 400, errorMessage: 'Entity not found' }, null];
      }
      await this.repository.delete({ id });
      return [null, entity];
    } catch {
      return [{ errorCode: 500, errorMessage: 'Server error' }, null];
    }
  }
}
