import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../schemas/order.schema';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsNumber()
  depositAmount?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
