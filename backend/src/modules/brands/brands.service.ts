import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandModel.create(createBrandDto);
  }

  async findAll(): Promise<Brand[]> {
    return this.brandModel.find().exec();
  }

  async findById(id: string): Promise<Brand | null> {
    return this.brandModel.findById(id).exec();
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand | null> {
    return this.brandModel.findByIdAndUpdate(id, updateBrandDto, {
      new: true,
    }).exec();
  }

  async delete(id: string): Promise<Brand | null> {
    return this.brandModel.findByIdAndDelete(id).exec();
  }
}
