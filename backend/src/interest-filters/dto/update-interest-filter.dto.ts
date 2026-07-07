import { PartialType } from '@nestjs/swagger';
import { CreateInterestFilterDto } from './create-interest-filter.dto';

export class UpdateInterestFilterDto extends PartialType(CreateInterestFilterDto) {}
