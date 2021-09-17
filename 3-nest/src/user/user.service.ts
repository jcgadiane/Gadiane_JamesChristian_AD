import { Injectable } from '@nestjs/common';
import { captureRejections } from 'events';
import { User } from './user.model';

@Injectable()
export class UserService {
private  users: Map<number,User> = new Map<number,User>();

    addUser(newUser:any){
        for(const [number,user] of this.users.entries()){
            if(user['id'] == newUser.id)
            return false;
        }
        newUser = new User(newUser.id, newUser.username,newUser.password,newUser.fname,newUser.lname);
        this.users.set(newUser.id, newUser);
        return true;
    }

    displayAll(){
        for(const [number,user] of this.users.entries()){
            user.displayUser();
        }
    }

    displayID(id: number){
        let retval : any;
        for(const [number,user] of this.users.entries()){
            if(user['id'] == id)
                user.displayUser();
            else
                retval = "id not found";
        }
    }

    editUser(newValue: any, id: number){
        for(const [number,user] of this.users.entries()){
            if(user['id'] == id){
                user['username'] = newValue.username;
                user['password'] = newValue.password;
                user['fname'] = newValue.fname;
                user['sname'] = newValue.sname;
                return "true";
            }
        }

        return "false";
    }

    deleteUser(id: number){
        if(this.users.get(id) != null)
        {   
            this.users.delete(id);
            return "true";
            }
    return "false";
        }

    userLogin(credentials:any){
        for(const [number,user] of this.users.entries()){
            if(user['username'] == credentials.username){
                if(user['password'] == credentials.password){
                    return "true";
            }
        }

        return "false";
        }

    }
    searchTerm(term:string){
        for(const [number,user] of this.users.entries()){
            if(user['fname'].toUpperCase() == term.toUpperCase()){
                return user.displayUser();
            }else if(user['lname'].toUpperCase() == term.toUpperCase()){
                return user.displayUser();
            }else if(user['username'].toUpperCase() == term.toUpperCase()){
                return user.displayUser();
            }
        }
        return console.log('not found');
    }
}