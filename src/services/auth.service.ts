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
        const encryptedPassword = password ? await hashPassword(password as string) : null;
        return this.prisma.users.create({
            data: {
                password: password ? encryptedPassword as string : null,
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

    async getGoogleUserData(access_token: any) {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        const data = await response.json();
        return data;
    }
}

export default AuthService;