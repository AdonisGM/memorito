import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbService } from './mongodb.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(''),
  ],
  providers: [MongodbService],
  exports: [MongodbService],
})
export class MongodbModule {}
