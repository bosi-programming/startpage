import type { FindOptionsWhere, Repository } from "typeorm";

export class BaseModel<T extends { id: number }> {
  repository;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  public async create(props: Omit<T, 'id'>): Promise<[{ errorCode: number, errorMessage: string } | null, T | null]>  {
    try {
      const newEntry = this.repository.create(props as T);
      await this.repository.save(newEntry);
      return [null, newEntry]
    } catch {
      return [{ errorCode: 500, errorMessage: "Server error" }, null];
    }
  }

  public async getById(id: number): Promise<[{ errorCode: number, errorMessage: string } | null, T | null]> {
    try {
      const user = await this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
      if (!user) {
        return [{ errorCode: 400, errorMessage: "User not found" }, null];
      }
      return [null, user];
    } catch {
      return [{ errorCode: 500, errorMessage: "Server error" }, null];
    }
  }
}
