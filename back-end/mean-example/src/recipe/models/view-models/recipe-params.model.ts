import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { RecipeType } from '../recipe-type.enum';
import { RecipeLevel } from '../recipe-level.enum';

export class RecipeParams {
  @ApiModelProperty() title: string;
  @ApiModelPropertyOptional({ enum: RecipeType, example: RecipeType.Breakfast })
  type?: RecipeType;
  @ApiModelPropertyOptional({ enum: RecipeLevel, example: RecipeLevel.Easy })
  level?: RecipeLevel;
  @ApiModelProperty() ingredients: string[];
  @ApiModelProperty() description: string;
}
