import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  
  @ApiOperation({ 
    summary: 'Verificar estado de la API', 
    description: 'Endpoint simple para confirmar que el servidor backend está respondiendo.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'El servidor funciona correctamente (Retorna Hello World).' 
  })

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
