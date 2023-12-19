import { IsInt, IsPositive, Min, IsString, MinLength } from 'class-validator';

export class CreatePokemonDto {
  //isInt, isPositive, min 1
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;
  //isString,minLenth 1
  @IsString()
  @MinLength(1)
  name: string;
}
