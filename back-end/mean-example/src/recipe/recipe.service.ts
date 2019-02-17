import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { BaseService } from '../shared/base.service';
import { MapperService } from '../shared/mapper/mapper.service';
import { Recipe } from './models/recipe.model';
import { RecipeParams } from './models/view-models/recipe-params.model';

@Injectable()
export class RecipeService extends BaseService<Recipe> {
  constructor(
    @InjectModel(Recipe.modelName)
    private readonly _recipeModel: ModelType<Recipe>,
    private readonly _mapperService: MapperService,
  ) {
    super();
    this._model = _recipeModel;
    this._mapper = _mapperService.mapper;
  }

  async createRecipe(params: RecipeParams): Promise<Recipe> {
    const { title, description, ingredients, level, type } = params;

    const newRecipe = Recipe.createModel();

    newRecipe.title = title;
    newRecipe.description = description;
    newRecipe.ingredients = ingredients;

    if (level) {
      newRecipe.level = level;
    }

    if (type) {
      newRecipe.type = type;
    }

    try {
      const result = await this.create(newRecipe);
      return result.toJSON() as Recipe;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
