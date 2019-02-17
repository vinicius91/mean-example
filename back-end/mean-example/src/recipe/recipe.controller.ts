import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiImplicitQuery,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { isArray, map } from 'lodash';
import { ApiException } from '../shared/api-exception.model';
import { ToBooleanPipe } from '../shared/pipes/to-boolean.pipe';
import { GetOperationId } from '../shared/utilities/get-operation-id.helper';
import { Recipe } from './models/recipe.model';
import { RecipeService } from './recipe.service';
import { RecipeVm } from './models/view-models/recipe-vm.model';
import { RecipeParams } from './models/view-models/recipe-params.model';
import { RecipeLevel } from './models/recipe-level.enum';
import { RecipeType } from './models/recipe-type.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/user/models/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('recipes')
@ApiUseTags(Recipe.modelName)
@ApiBearerAuth()
export class RecipeController {
  constructor(private readonly _recipeService: RecipeService) {}

  @Post()
  @Roles(UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiCreatedResponse({ type: RecipeVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(Recipe.modelName, 'Create'))
  async create(@Body() params: RecipeParams): Promise<RecipeVm> {
    try {
      const newRecipe = await this._recipeService.createRecipe(params);
      return this._recipeService.map<RecipeVm>(newRecipe);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @Roles(UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({ type: RecipeVm, isArray: true })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(Recipe.modelName, 'GetAll'))
  @ApiImplicitQuery({
    name: 'level',
    enum: RecipeLevel,
    required: false,
    isArray: true,
  })
  @ApiImplicitQuery({
    name: 'type',
    enum: RecipeType,
    required: false,
    isArray: true,
  })
  async get(
    @Query('level') level?: RecipeLevel,
    @Query('type') type?: RecipeType,
  ): Promise<RecipeVm[]> {
    let filter = {};

    if (level) {
      filter['level'] = { $in: isArray(level) ? [...level] : [level] };
    }

    if (type) {
      if (filter['level']) {
        filter = { $and: [{ level: filter['level'] }, { type }] };
      } else {
        filter['type'] = type;
      }
    }

    try {
      const Recipes = await this._recipeService.findAll(filter);
      return this._recipeService.map<RecipeVm[]>(
        map(Recipes, recipe => recipe.toJSON()),
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @Roles(UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({ type: RecipeVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(Recipe.modelName, 'Update'))
  async update(@Body() vm: RecipeVm): Promise<RecipeVm> {
    const { id, title, level, type, description, ingredients } = vm;

    if (!vm || !id) {
      throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
    }

    const exist = await this._recipeService.findById(id);

    if (!exist) {
      throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
    }

    exist.title = title;
    exist.description = description;
    exist.ingredients = ingredients;
    exist.type = type;
    exist.level = level;

    try {
      const updated = await this._recipeService.update(id, exist);
      return this._recipeService.map<RecipeVm>(updated.toJSON());
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @Roles(UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({ type: RecipeVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(Recipe.modelName, 'Delete'))
  async delete(@Param('id') id: string): Promise<RecipeVm> {
    try {
      const deleted = await this._recipeService.delete(id);
      return this._recipeService.map<RecipeVm>(deleted.toJSON());
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
