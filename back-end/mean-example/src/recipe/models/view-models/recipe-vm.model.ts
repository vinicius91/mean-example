import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from '../../../shared/base.model';
import { RecipeLevel } from '../recipe-level.enum';
import { RecipeType } from '../recipe-type.enum';

export class RecipeVm extends BaseModelVm {
  @ApiModelProperty() title: string;
  @ApiModelProperty({ enum: RecipeLevel })
  level: RecipeLevel;
  @ApiModelProperty({ enum: RecipeType })
  type: RecipeType;
  @ApiModelProperty() ingredients: string[];
  @ApiModelProperty() description: string;
}
