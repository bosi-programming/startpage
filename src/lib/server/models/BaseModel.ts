import type { FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";

export class BaseModel<T extends ObjectLiteral> {
  repository;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  public async create(props: Omit<T, 'id'>): Promise<[{ errorCode: number, errorMessage: string } | null, T | null]> {
    try {
      const newEntry = this.repository.create(props as T);
      await this.repository.save(newEntry);
      return [null, newEntry]
    } catch {
      return [{ errorCode: 500, errorMessage: "Server error" }, null];
    }
  }

  public async getById(id: number, userId: number): Promise<[{ errorCode: number, errorMessage: string } | null, T | null]> {
    try {
      const entity = await this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
      if (!entity) {
        return [{ errorCode: 400, errorMessage: "Entity not found" }, null];
      }
      const [error, isUserOwner] = this.checkOwnership(entity, userId);
      if (error || !isUserOwner) {
        return [error, null];
      }
      return [null, entity];
    } catch {
      return [{ errorCode: 500, errorMessage: "Server error" }, null];
    }
  }

  public async put(props: T, userId: number): Promise<[{ errorCode: number, errorMessage: string } | null, T | null]> {
    try {
      const entity = await this.repository.findOneBy({ id: props.id });
      if (!entity) {
        return [{ errorCode: 400, errorMessage: "Entity not found" }, null];
      }
      const [error, isUserOwner] = this.checkOwnership(entity, userId);
      if (error || !isUserOwner) {
        return [error, null];
      }
      await this.repository.update({ id: props.id }, props)
      const newEntity = await this.repository.findOneBy({ id: props.id })
      return [null, newEntity];
    } catch {
      return [{ errorCode: 500, errorMessage: "Server error" }, null];
    }
  }

  public async delete(id: T['id'], userId: number): Promise<[{ errorCode: number, errorMessage: string } | null, T | null]> {
    try {
      const entity = await this.repository.findOneBy({ id });
      if (!entity) {
        return [{ errorCode: 400, errorMessage: "Entity not found" }, null];
      }
      const [error, isUserOwner] = this.checkOwnership(entity, userId);
      if (error || !isUserOwner) {
        return [error, null];
      }
      await this.repository.delete({ id })
      return [null, entity];
    } catch {
      return [{ errorCode: 500, errorMessage: "Server error" }, null];
    }
  }

  public checkOwnership(entity: T, userId: number): [{ errorCode: number, errorMessage: string } | null, boolean | null] {
    try {
      const entityOwner = entity.user || entity.id
      if (entityOwner === userId) {
        return [null, true];
      }
      return [{ errorCode: 400, errorMessage: "User isn't the owner of the entity" }, false];
    } catch {
      return [{ errorCode: 500, errorMessage: "Server error" }, null];
    }
  }
}
