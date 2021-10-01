import { Injectable } from '@nestjs/common';
import { captureRejections } from 'events';
import { CRUDReturn } from './user.resource/crud_return.interface';
import { Helper } from './user.resource/helper';
import { User } from './user.model';
import { throws } from 'assert';
import { stringify } from 'querystring';
import e from 'express';

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map<string, User>();

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

  displayAll(): CRUDReturn {
    var results: Array<any> = [];
    for (const user of this.users.values()) {
      results.push(user.toJson());
    }
    return {
      success: results.length > 0,
      data: results,
    };
  }

  displayID(id: string): CRUDReturn {
    if (this.users.has(id)) {
      return { success: true, data: this.users.get(id).toJson() };
    } else {
      return {
        success: false,
        data: `User ${id} is not in database`,
      };
    }
  }

  editUser(newValue: any, id: string) {
    try {
      var validBody: { valid: boolean; data: string } =
        Helper.validBodyPut(newValue);
      if (this.missingAttribute(newValue)) {
        if (validBody.valid) {
          if (!this.emailUpdate(newValue.email, id)) {
            for (const [string, user] of this.users.entries()) {
              if (this.users.has(id)) {
                user['name'] = newValue.name;
                user['age'] = newValue.age;
                user['email'] = newValue.email;
                user['password'] = newValue.password;
                return {
                  success: true,
                  data: user.toJson(),
                };
              } else {
                throw new Error(`user ${newValue.id} does not exist`);
              }
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

  editUserPatch(newValue: any, id: string): CRUDReturn {
    try {
      var validBody: { valid: boolean; data: string } =
        Helper.validBody(newValue);
      if (validBody.valid) {
        if (!this.emailUpdate(newValue.email, id)) {
          for (const [string, user] of this.users.entries()) {
            if (this.users.has(id)) {
              if (newValue.name != null) user['name'] = newValue.name;
              if (newValue.age != null) user['age'] = newValue.age;
              if (newValue.email != null) user['email'] = newValue.email;
              if (newValue.password != null)
                user['password'] = newValue.password;
              return {
                success: true,
                data: this.users.get(id).toJson(),
              };
            } else {
              throw new Error(`user ${newValue.id} does not exist`);
            }
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

  deleteUser(credentials: any, id: string): CRUDReturn {
    let match = false;
    if (this.users.has(id)) {
      this.users.delete(id);
      return {
        success: true,
        data: 'User successfuly deleted',
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
