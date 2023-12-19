import { Module } from '@nestjs/common';
import { SeeService } from './see.service';
import { SeeController } from './see.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SeeController],
  providers: [SeeService],
  imports: [PokemonModule, CommonModule],
})
export class SeeModule {}
