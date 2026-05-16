import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EjemplaresService } from './ejemplares.service';
import { CreateEjemplarDto } from './dto/create-ejemplar.dto';
import { UpdateEjemplarDto } from './dto/update-ejemplar.dto';

@Controller('ejemplares')
export class EjemplaresController {
  constructor(private readonly ejemplaresService: EjemplaresService) {}

  @Post()
  create(@Body() createEjemplarDto: CreateEjemplarDto) {
    return this.ejemplaresService.create(createEjemplarDto);
  }

  @Get()
  findAll() {
    return this.ejemplaresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ejemplaresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEjemplarDto: UpdateEjemplarDto,
  ) {
    return this.ejemplaresService.update(id, updateEjemplarDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ejemplaresService.remove(id);
  }
}
