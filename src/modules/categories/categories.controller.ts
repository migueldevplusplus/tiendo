import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto.js';
import { CategoriesService } from './categories.service.js';
import { Category } from '../../generated/prisma/client.js';
import { UpdateCategoryDto } from './dtos/update-category.dto.js';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly service: CategoriesService){}

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.service.create(createCategoryDto);
    }

    @Get()
    async findAll(): Promise<Category[]> {
        return this.service.findAll();
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Category> {
        return this.service.findById(id);
    }


    @Patch(':id')
    async updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto : UpdateCategoryDto
    ): Promise<Category> {
        return this.service.updateCategory(id, updateCategoryDto);
    }
}
