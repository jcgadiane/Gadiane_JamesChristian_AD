export class User {
    private id: number;
    private username: string;
    private password: string;
    private fname: string;
    private lname: string;


    constructor(id:number,username:string,password:string,fname:string,lname:string){
        this.id=id;
        this.username=username;
        this.password = password;
        this.fname = fname;
        this.lname = lname;
    }

    displayUser(){
        console.log(`ID: ${this.id}`);
        console.log(`Username: ${this.username}`);
        console.log(`First Name: ${this.fname}`);
        console.log(`Last Name: ${this.lname}`);
    }
}