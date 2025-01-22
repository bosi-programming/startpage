import { Config as ConfigEntity } from "../entities/Config";
import { configRepository } from "../repositories";
import { BaseModel } from "./BaseModel";

class Config extends BaseModel<ConfigEntity> {
}

export const configModel = new Config(configRepository);
