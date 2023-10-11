import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PageService } from './page.service';
import { PageController } from './page.controller';

import { Page, PageSchema } from './entity/page.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
  controllers: [PageController],
  providers: [PageService, Logger],
})
export class PageModule {}
