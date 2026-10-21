import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('CategoriesService', () => {
    let categoriesService: CategoriesService;

    const prismaMock = {
        category: {
        aggregate: vi.fn(),
        create: vi.fn(),
        findUnique: vi.fn(),
    },
    };

    beforeEach(() => {
        vi.clearAllMocks();   // reset calls between tests
        categoriesService = new CategoriesService(prismaMock as unknown as PrismaService);
    });

    it('creates the category after the highest position', async () => {
        prismaMock.category.aggregate.mockResolvedValue({ _max: { position: 3 } });

        await categoriesService.create({ name: 'Bebidas' });

        expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: { name: 'Bebidas', position: 4 },
        });
    });

    it('creates the first category with position 1', async () => {
        prismaMock.category.aggregate.mockResolvedValue({ _max: { position: null } });

        await categoriesService.create({ name: 'Hamburguesas' });

        expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: { name: 'Hamburguesas', position: 1 },
        });
    });

    it('throws NotFoundException when the category does not exist', async () => {
        prismaMock.category.findUnique.mockResolvedValue(null);

        await expect(categoriesService.findById(999)).rejects.toThrow(NotFoundException);
    });
});