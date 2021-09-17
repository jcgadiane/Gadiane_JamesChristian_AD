import { Controller, Get, Post, Body, Param, Put, Patch, Delete } from '@nestjs/common';
import { User } from './user.model';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Get("/all")
    displayAll(){
        return this.userService.displayAll();
    }

    @Post("/register")
    addUser(@Body() body:User){
        return this.userService.addUser(body);
    }

    @Get("/:id")
    displayID(@Param('id') num:string){
        var parsedNum:number = parseInt(num);
        return this.userService.displayID(parsedNum);
    }

    @Put("/:id")
    editUser(@Body() body:User, @Param('id') num:string){
        var parsedNum:number = parseInt(num);
        return this.userService.editUser(body, parsedNum);
    }

    @Patch("/:id")
    editUserPatch(@Body() body:User, @Param('id') num:string){
        var parsedNum:number = parseInt(num);
        return this.userService.editUser(body, parsedNum);
    }

    @Delete("/:id")
    deleteUser(@Param('id') num:string){
        var parsedNum:number = parseInt(num);
        return this.userService.deleteUser(parsedNum);
    }

    @Post("/login")
    userLogin(@Body() body:User){
        return this.userService.userLogin(body);
    }

    @Get("/search/:term")
    searchTerm(@Param('term') term:string){
        return this.userService.searchTerm(term);
    }
}