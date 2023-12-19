import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.getOrThrow<number>('defaultLimit');
  }
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    //el offset es la paginacion y el limit es el numero de elementos
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel.find().limit(limit).skip(offset).sort({ no: 1 });
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({
        no: term,
      });
    }
    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase(),
      });
    }
    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      }
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON, ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    //const pokemon = await this.findOne(id);
    //await pokemon.deleteOne();
    const result = await this.pokemonModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Pokemon not found');
    }
    return result;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Pokemon already exists');
    }
    throw new InternalServerErrorException('Error creating pokemon');
  }
}
