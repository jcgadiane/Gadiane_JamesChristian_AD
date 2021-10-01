import { CRUDReturn } from './user.resource/crud_return.interface';
import { Helper } from './user.resource/helper';
export class User {
  public id: string;
  public name: string;
  public age: number;
  public email: string;
  public password: string;

  constructor(name: string, age: number, email: string, password: string) {
    this.id = Helper.generateUID();
    this.name = name;
    this.age = age;
    this.email = email;
    this.password = password;
  }

  login(password: string): CRUDReturn {
    try {
      if (this.password === password) {
        return { success: true, data: this.toJson() };
      } else {
        throw new Error(`${this.email} login fail, password does not match`);
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  }

  log() {
    console.log(this.toJson());
  }


  toJson() {    
    return {
        id:this.id,
        name:this.name,
        age:this.age,
        email:this.email
    };
  }


}