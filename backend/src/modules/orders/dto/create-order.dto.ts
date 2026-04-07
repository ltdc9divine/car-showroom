import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderItemDto {
  @IsString()
  car!: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}

export class CreateOrderDto {
  @IsArray()
  items!: OrderItemDto[];

  @IsNumber()
  total!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  shippingAddress?: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
