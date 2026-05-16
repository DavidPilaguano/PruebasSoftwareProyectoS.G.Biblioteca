import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsuariosSistemaService } from './usuarios-sistema.service';
import { CreateUsuarioSistemaDto } from './dto/create-usuario-sistema.dto';
import { UpdateUsuarioSistemaDto } from './dto/update-usuario-sistema.dto';

@Controller('usuarios-sistema')
export class UsuariosSistemaController {
  constructor(private readonly usuariosSistemaService: UsuariosSistemaService) {}

  @Post()
  create(@Body() createUsuarioSistemaDto: CreateUsuarioSistemaDto) {
    return this.usuariosSistemaService.create(createUsuarioSistemaDto);
  }

  @Get()
  findAll() {
    return this.usuariosSistemaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosSistemaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioSistemaDto: UpdateUsuarioSistemaDto,
  ) {
    return this.usuariosSistemaService.update(id, updateUsuarioSistemaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosSistemaService.remove(id);
  }
}
