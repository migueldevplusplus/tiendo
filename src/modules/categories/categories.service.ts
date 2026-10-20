
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCategoryDto } from './dtos/create-category.dto.js';
import { UpdateCategoryDto } from './dtos/update-category.dto.js';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createCategoryDto: CreateCategoryDto){
        let lastPosition = await this.prisma.category.aggregate(
            {_max: {position : true} }
        );

        return this.prisma.category.create({data: 
            {
                name: createCategoryDto.name, 
                position: (lastPosition._max.position ?? 0) + 1,
            } 
        });
    }

    async findAll(){
        return this.prisma.category.findMany({orderBy : {position : 'asc'}});
    }

    async findById(id : number){
        const category = await this.prisma.category.findUnique({where: {id} });

        if(!category){
            throw new NotFoundException(`Category ${id} not found`);
        }

        return category;
    }

    async updateCategory(id : number, updateCategoryDto : UpdateCategoryDto){
        await this.findById(id);

        return this.prisma.category.update(
            {where: {id}, 
            data : updateCategoryDto})
    }
}
