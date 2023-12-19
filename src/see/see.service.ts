import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/pokemon-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeeService {
  private readonly axios: AxiosInstance = axios;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  //aqui tendremos 3 formas  de hacer el seed

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const { data } = await axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );
    const insertPromisesArray = []; //array de promesas

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      //  const pokemon = await this.pokemonModel.create({ name, no });
      insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    });
    await Promise.all(insertPromisesArray);
    return 'seed executed';
  }

  async executeSeed2() {
    await this.pokemonModel.deleteMany({});
    const { data } = await axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );
    const pokemonToInsert: { name: string; no: number }[] = []; //array de promesas

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      //  const pokemon = await this.pokemonModel.create({ name, no });
      pokemonToInsert.push({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'seed executed';
  }
  async executeSeed3() {
    //este usa el adapter de axios
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );
    const insertPromisesArray = []; //array de promesas

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      //  const pokemon = await this.pokemonModel.create({ name, no });
      insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    });
    await Promise.all(insertPromisesArray);
    return 'seed executed';
  }
}
