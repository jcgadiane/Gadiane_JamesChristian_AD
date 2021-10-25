import { Injectable } from '@nestjs/common';
import { captureRejections } from 'events';
import { CRUDReturn } from './user.resource/crud_return.interface';
import { Helper } from './user.resource/helper';
import { User } from './user.model';
import { throws } from 'assert';
import { stringify } from 'querystring';
import e from 'express';
import * as admin from 'firebase-admin';
import { catchError } from 'rxjs';
import { doc } from 'prettier';

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map<string, User>();
  private DB = admin.firestore();

  constructor() {
    this.users = Helper.populate();
  }

  addUser(newUser: any): CRUDReturn {
    try {
      var validBody: { valid: boolean; data: string } =
        Helper.validBody(newUser);
      if (this.missingAttribute(newUser)) {
        if (validBody.valid) {
          if (!this.emailExists(newUser.email)) {
            var registration = new User(
              newUser.name,
              newUser.age,
              newUser.email,
              newUser.password,
            );

            if (this.saveToDB(registration)) {
              return {
                success: true,
                data: registration.toJson(),
              };
            } else {
              throw new Error('generic database error');
            }
          } else {
            throw new Error(
              `${newUser.email} is already in use by another user`,
            );
          }
        } else {
          throw new Error(validBody.data);
        }
      } else {
        throw new Error('user is missing an attribute');
      }
    } catch (error) {
      return {
        success: false,
        data: `Error adding user, ${error.message}`,
      };
    }
  }

  async displayAll(): Promise<CRUDReturn> {
    var results: Array<any> = [];
    try{
      var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await this.DB.collection("users").get();
      dbData.forEach((doc)=>{
        if(doc.exists){
          results.push({id: doc.id, name: doc.data()['name'], age: doc.data()['age'], email: doc.data()['email']
        });
        }
      });
      return {
        success: true,
        data: results
  }
}catch (e) {
      return{
        success: false,
        data: e
      }
    }
  }

  async displayID(id: string): Promise<CRUDReturn> {
    try {
      var result = await this.DB.collection('users').doc(id).get();
      if (result.exists) {
        return {
          success: true,
          data: result.data(),
        };
      } else {
        return {
          success: false,
          data: `User ${id} does not exist in database!`,
        };
      }
    } catch (error) {
      return {
        success: false,
        data: error,
      };
    }
  }

  async editUser(newValue: any, id: string) {
    try {
      var result = await this.DB.collection('users').doc(id).get();
      var validBody: { valid: boolean; data: string } =
        Helper.validBodyPut(newValue);
      if (this.missingAttribute(newValue)) {
        if (validBody.valid) {
          if (!this.emailUpdate(newValue.email, id)) {
              if (result.exists) {
                  this.DB.collection("users").doc(id).update({
                    "name": newValue.name
                  });
                  this.DB.collection("users").doc(id).update({
                  "age": newValue.age
                });
                this.DB.collection("users").doc(id).update({
                  "email": newValue.email
                });
                 this.DB.collection("users").doc(id).update({
                  "password": newValue.password
                });
              } else {
                throw new Error(`user ${newValue.id} does not exist`);
              }
          } else {
            throw new Error(
              `${newValue.email} is already in use by another user`,
            );
          }
        } else {
          throw new Error(validBody.data);
        }
      } else {
        throw new Error('user is missing an attribute');
      }
    } catch (error) {
      return {
        success: false,
        data: `Error adding user, ${error.message}`,
      };
    }
  }

  async editUserPatch(newValue: any, id: string): Promise<CRUDReturn> {
    try {
      var result = await this.DB.collection('users').doc(id).get();
      var validBody: { valid: boolean; data: string } =
        Helper.validBody(newValue);
      if (validBody.valid) {
        if (!this.emailUpdate(newValue.email, id)) {
            if (result.exists) {
              if (newValue.name != null) {
                this.DB.collection("users").doc(id).update({
                  "name": newValue.name
                });
              } 
              if (newValue.age != null) { this.DB.collection("users").doc(id).update({
                "age": newValue.age
              });}
              if (newValue.email != null) { this.DB.collection("users").doc(id).update({
                "email": newValue.email
              });}
              if (newValue.password != null){ this.DB.collection("users").doc(id).update({
                "password": newValue.password
              });}
              return {
                success: true,
                data: this.users.get(id).toJson(),
              };
            } else {
              throw new Error(`user ${newValue.id} does not exist`);
            }
        } else {
          throw new Error(
            `${newValue.email} is already in use by another user`,
          );
        }
      } else {
        throw new Error(validBody.data);
      }
    } catch (error) {
      return {
        success: false,
        data: `Error updating user values: ${error.message}`,
      };
    }
  }

  async deleteUser(id: string): Promise<CRUDReturn> {
    var result = await this.DB.collection('users').doc(id).get();
    if (result.exists) {
      this.DB.collection("users").doc(id).delete();
      return {
        success: true,
        data: 'User successfully deleted',
      };
    } else
      return {
        success: false,
        data: `User not found`,
      };
  }

  userLogin(credentials: any): CRUDReturn {
    try {
      for (const [number, user] of this.users.entries()) {
        if (
          user['password'] === credentials.password &&
          user['email'] === credentials.email
        ) {
          return {
            success: true,
            data: user.toJson(),
          };
        } else if (
          user['password'] != credentials.password &&
          user['email'] === credentials.email
        ) {
          throw new Error(`Authentication error: password does not match`);
        } else if (
          user['password'] === credentials.password &&
          user['email'] != credentials.email
        ) {
          throw new Error(`Authentication error: email does not match`);
        }
      }
    } catch (error) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  searchTerm(term: string): CRUDReturn {
    var results: Array<any> = [];
    for (const [string, user] of this.users.entries()) {
      if (user['id'].toUpperCase() == term.toUpperCase()) {
        results.push(user.toJson());
      } else if (user['name'].toUpperCase() == term.toUpperCase()) {
        results.push(user.toJson());
      } else if (user['age'].toString() == term) {
        results.push(user.toJson());
      } else if (user['email'].toUpperCase() == term.toUpperCase()) {
        results.push(user.toJson());
      }
    }
    if (results.length != 0) {
      return {
        success: true,
        data: results,
      };
    } else {
      return {
        success: false,
        data: [],
      };
    }
  }

 saveToDB(user: User): boolean {
    try {
      this.DB.collection('users').doc().set(user.toJson());
      this.users.set(user.id, user);
      return this.users.has(user.id);
    } catch (error) {
      return false;
    }
  }

  emailExists(email: string): boolean {
    for (const [string, user] of this.users.entries()) {
      if (
        user['email'].localeCompare(email, undefined, {
          sensitivity: 'base',
        }) == 0
      ) {
        return true;
      }
    }
    return false;
  }


  emailUpdate(email: string, id: string): boolean {
    for (const [string, user] of this.users.entries()) {
      if (user['id'] == id) {
        if (
          user['email'].localeCompare(email, undefined, {
            sensitivity: 'base',
          }) == 0
        ) {
          return false;
        }
      } else {
        if (
          user['email'].localeCompare(email, undefined, {
            sensitivity: 'base',
          }) == 0
        ) {
          return true;
        }
      }
    }
    return false;
  }

  missingAttribute(body: any): boolean {
    if (body.name == null) {
      return false;
    }
    if (body.age == null) {
      return false;
    }
    if (body.email == null) {
      return false;
    }
    if (body.password == null) {
      return false;
    }
    return true;
  }
}
