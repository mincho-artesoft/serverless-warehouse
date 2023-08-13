// object.entity.ts
import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BaseEntity,
} from 'typeorm';
import { Point } from 'geojson';
import { ObjectId } from 'mongodb';

@Entity('test')
export class TestLoc{
  @ObjectIdColumn()
  _id!: ObjectId;

  
  @Column("geometry", {
    spatialFeatureType: "Point",
    srid: 4326,
})
location: IGeometry
}

interface IGeometry {
    type: "Point"
    coordinates: [number, number]
}
/* 

@Entity()
export class Thing {
    @Column("geometry", {
        spatialFeatureType: "Point",
        srid: 4326,
    })
    @Index({ spatial: true })
    point: Geometry
} */