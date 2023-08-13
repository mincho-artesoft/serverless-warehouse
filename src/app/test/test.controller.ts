import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import {TestLoc } from './entities/test.entity';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  async createObjectWithLocation(@Body() coordinates: TestLoc ) {
    
    return this.testService.createObjectWithLocation(coordinates);
  }

  @Get('nearby')
  async findObjectsNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('maxDistance') maxDistance: number,
  ) {
    return this.testService.findLocationsNearby(+latitude, +longitude, +maxDistance);
  }
}
