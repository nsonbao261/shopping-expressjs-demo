import { PrismaClient } from '@prisma/client';
import { registerDto } from '../dto/register-dto';
import { hashPassword } from '../utils';
import { updateUserDto } from '../dto/update-user.dto';

class AuthService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async signUp(dto: registerDto) {
        const { password, ...rest } = dto;
        const encryptedPassword = await hashPassword(password);
        return this.prisma.users.create({
            data: {
                password: encryptedPassword as string,
                ...rest,
            },
            select: {
                userId: true,
                email: true,
                firstName: true,
                lastName: true,
                gender: true,
                role: true,
            }
        })
    }

    async findUserById(userId: string) {
        return this.prisma.users.findUnique({
            where: {
                userId: userId,
            }
        })
    }

    async findUserByEmail(email: string) {
        return this.prisma.users.findUnique({
            where: {
                email,
            }
        })
    }

    async updateUser(userId: string, data: updateUserDto) {
        return this.prisma.users.update({
            where: {
                userId,
            },
            data
        })
    }
}

export default AuthService;