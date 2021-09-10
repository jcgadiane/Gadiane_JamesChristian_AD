import { Injectable } from '@nestjs/common';

@Injectable()
export class Exercise3Service {
    loopsTriangle(height: number){
        var asterisk = "*";

        for(var i = 0; i < height; i++){
        console.log(asterisk);
        asterisk = asterisk + "*";
    }
    }
    hello(name: string){
        return 'Hi there, ' + name +'!';
    }
    primeNumber(num: number){
        var flag = true;
    for(var i = 2; i < num; i++){
        if(num % i == 0){
            flag = false;
            break;
        }
    }
    if (flag == true){
        return 'The number(' + num + ') you have entered is a prime number';
    } 
    else {  
        return 'The number(' + num + ') you have entered is not a prime number';
    }
    }

    }
