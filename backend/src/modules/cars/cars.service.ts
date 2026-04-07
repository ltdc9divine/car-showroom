import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { CreateCarDto, UpdateCarDto } from './dto/create-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
  ) {}

  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
  }

  async create(createCarDto: CreateCarDto): Promise<CarDocument> {
    // Validate brand is a valid ObjectId
    if (!this.isValidObjectId(createCarDto.brand)) {
      throw new BadRequestException('Invalid brand ID format');
    }
    
    return this.carModel.create({
      ...createCarDto,
      brand: new Types.ObjectId(createCarDto.brand),
    });
  }

async findAll(filters: any = {}): Promise<CarDocument[]> {
    console.log('=== Cars findAll filters ===', filters);
    const query: any = { isAvailable: true };
    console.log('Query built:', query);
    const result = await this.carModel.find(query).populate('brand').sort({ createdAt: -1 }).exec();
    console.log('Query result count:', result.length);
    return result;



    if (filters.brand) {
      // Handle both brand name and brand ID
      if (this.isValidObjectId(filters.brand)) {
        query.brand = new Types.ObjectId(filters.brand);
      } else {
        // If not a valid ObjectId, assume it's a brand name and use regex
        query.brand = { $regex: filters.brand, $options: 'i' };
      }
    }
    if (filters.fuel) query.fuel = filters.fuel;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) query.price.$lte = Number(filters.maxPrice);
    }
    if (filters.minYear !== undefined || filters.maxYear !== undefined) {
      query.year = {};
      if (filters.minYear !== undefined) query.year.$gte = Number(filters.minYear);
      if (filters.maxYear !== undefined) query.year.$lte = Number(filters.maxYear);
    }
    
    // Use regex search instead of text search to avoid index issues
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return this.carModel
      .find(query)
      .populate('brand')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<CarDocument | null> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid car ID format');
    }
    
    const car = await this.carModel.findById(id).populate('brand').exec();
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }

  async update(
    id: string,
    updateCarDto: UpdateCarDto,
  ): Promise<CarDocument | null> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid car ID format');
    }

    // Convert brand to ObjectId if provided
    const updateData: any = { ...updateCarDto };
    if (updateData.brand && this.isValidObjectId(updateData.brand)) {
      updateData.brand = new Types.ObjectId(updateData.brand);
    }

    const car = await this.carModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('brand')
      .exec();
    
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }

  async delete(id: string): Promise<CarDocument | null> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid car ID format');
    }

    const car = await this.carModel.findByIdAndDelete(id).exec();
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }

  async search(query: string): Promise<CarDocument[]> {
    // Use regex search instead of text search
    return this.carModel
      .find({
        $and: [
          { isAvailable: true },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
            ],
          },
        ],
      })
      .populate('brand')
      .exec();
  }
}
