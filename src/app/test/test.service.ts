import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestLoc } from './entities/test.entity';
import { MongoClient } from "mongodb";
@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestLoc)
    private readonly locationRepository: Repository<TestLoc>
  ) {}

  async createObjectWithLocation(coordinates: TestLoc): Promise<TestLoc> {
    // const newObject = this.locationRepository.create({ coordinates });
    this.createGeospatialIndex();
    console.log(coordinates);
    return this.locationRepository.save(coordinates);
  }

  async findLocationsNearby(
    latitude: number,
    longitude: number,
    maxDistance: number
  ) {
    return this.locationRepository.find({
      //@ts-ignore
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
          },
        },
      });
    /*   async findLocationsNearby(
    latitude: number,
    longitude: number,
    maxDistance: number
  ) {
    return this.locationRepository.find({
      //@ts-ignore
      location: {
        $geoWithin: {
          $centerSphere: [
            [43.77411049325019, 23.737189394542774],
            0.000008215282325232803,
          ],
        },
      },
    });
  } */
  }
  async createGeospatialIndex() {
    const uri = "mongodb+srv://minchomilev:Samoenter123@cluster0.pfnuj.mongodb.net/"; 
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
  
      const database = client.db("test");
      const collection = database.collection("test"); 
  
      await collection.createIndex({ location: "2dsphere" });
  
      console.log("Geospatial index created successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      await client.close();
    }
  }
}


