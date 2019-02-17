import { InstanceType, ModelType, prop } from 'typegoose';
import { BaseModel, schemaOptions } from '../../shared/base.model';
import { RecipeType } from './recipe-type.enum';
import { RecipeLevel } from './recipe-level.enum';

export class Recipe extends BaseModel<Recipe> {
  @prop({ required: [true, 'Title is required'] })
  title: string;
  @prop({ enum: RecipeType, default: RecipeType.Lunch })
  type: RecipeType;
  @prop({ enum: RecipeLevel, default: RecipeLevel.Easy })
  level: RecipeLevel;
  @prop({ required: [true, 'Ingredient list is required'] })
  ingredients: string[];
  @prop({ required: [true, 'Description is required'] })
  description: string;
  @prop({ default: false })
  isCompleted: boolean;

  static get model(): ModelType<Recipe> {
    return new Recipe().getModelForClass(Recipe, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }

  static createModel(): InstanceType<Recipe> {
    return new this.model();
  }
}
