import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeeModule } from './see/see.module';
import { ConfigModule } from '@nestjs/config';
import { envConfiguration } from './common/config/app.config';
import { JoiValidationSchema } from './common/config/joi.validation';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PokemonModule,
    MongooseModule.forRoot(process.env.MONGODB, { dbName: 'pokemons' }),
    CommonModule,
    SeeModule,
  ],
})
export class AppModule {}
