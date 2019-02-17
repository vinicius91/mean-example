import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe } from './models/recipe.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recipe.modelName, schema: Recipe.model.schema },
    ]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
