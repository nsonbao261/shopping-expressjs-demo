import { Role } from "@prisma/client";

export interface registerDto {
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    gender?: string;
    role: Role
    avatar?: string;
}