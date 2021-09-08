var number = 0;
var flag = true;

for(x = 0; x < 2; x++){
if(x == 0){
    number = 5;
    for( i = 2; i < number; i++){
        if(number % i == 0){
            flag = false;
            break;
        }
    }
    
    if (flag == true){
        console.log (number + " is a prime number");
    } 
    else {
        console.log (number + " is a not prime number");
    }
} else if (x == 1){
    number = 6;
    for( i = 2; i < number; i++){
        if(number % i == 0){
            flag = false;
            break;
        }
    }
    
    if (flag == true){
        console.log (number + " is a prime number");
    } 
    else {
        console.log (number + " is a not prime number");
    }

}

}

