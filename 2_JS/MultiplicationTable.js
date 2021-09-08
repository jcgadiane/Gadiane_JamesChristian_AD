var table = '\t';
for (i = 0; i <= 10; i++) {
    for ( j = 0; j <= 10; j++) {
        if(i == 0 && j > 0){
          table += j + " \t";
        } 
        else if(j == 0 && i>0){
          table += i + "\t";
        } 
        else if(i>0 && j>0){
        table += (i*j) + "\t";
        }
    }
    table += '\n'
}

console.log(table);