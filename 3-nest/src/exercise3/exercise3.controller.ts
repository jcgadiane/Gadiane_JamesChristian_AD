import { Controller, Get, Param } from '@nestjs/common';
import { Exercise3Service } from './exercise3.service';

@Controller('exercise3')
export class Exercise3Controller {
    constructor(private readonly e3: Exercise3Service) {}
    @Get('/LoopsTriangle/:height')
    loopsTriangle(@Param('height') height:string){
        var parsedHeight:number = parseInt(height);
        return this.e3.loopsTriangle(parsedHeight);
    }
    @Get('/hello/:name')
    hello(@Param('name') name:string){
        return this.e3.hello(name);
    }
    @Get('/primeNumber/:input')
    primeNumber(@Param('input') num:string){
        var parsedNum:number = parseInt(num);
        return this.e3.primeNumber(parsedNum);
    }
}
