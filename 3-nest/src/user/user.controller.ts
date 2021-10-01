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
    displayID(@Param('id') id:string){
        return this.userService.displayID(id);
    }

    @Put("/:id")
    editUser(@Body() body:User, @Param('id') id:string){
        return this.userService.editUser(body, id);
    }

    @Patch("/:id")
    editUserPatch(@Body() body:User, @Param('id') id:string){
        return this.userService.editUserPatch(body, id);
    }

    @Delete("/:id")
    deleteUser(@Body() body:User, @Param('id') id:string){
        return this.userService.deleteUser(body, id);
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