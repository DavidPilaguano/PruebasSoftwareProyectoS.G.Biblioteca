import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EditorialesService } from './editoriales.service';
import { CreateEditorialDto } from './dto/create-editorial.dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';

@Controller('editoriales')
export class EditorialesController {
  constructor(private readonly editorialesService: EditorialesService) {}

  @Post()
  create(@Body() createEditorialDto: CreateEditorialDto) {
    return this.editorialesService.create(createEditorialDto);
  }

  @Get()
  findAll() {
    return this.editorialesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.editorialesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEditorialDto: UpdateEditorialDto,
  ) {
    return this.editorialesService.update(id, updateEditorialDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.editorialesService.remove(id);
  }
}
