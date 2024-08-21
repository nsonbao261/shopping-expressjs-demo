import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils";

const prisma = new PrismaClient();

const main = async () => {

    const encryptedPassword = await hashPassword("12345678");

    await prisma.users.create({
        data: {
            email: "customer@example.com",
            firstName: "Nguyễn",
            lastName: "Sơn Bão",
            password: encryptedPassword,
            role: "Customer",
        }
    });

    await prisma.categories.createMany({
        data: [
            {
                categoryName: "Abstract Strategy",
                description: 'Abstract Strategy is game involves little to no luck, with straight forward and simple design'
            },
            {
                categoryName: "Social Deduction",
                description: 'Social Deduction is game where players are given some secret roles with their own defination, players ussually need to discover secret hiding by other'
            },
            {
                categoryName: "Dice Roll",
                description: "Dice role is games involve players to take action base on the result of dice rolling"
            },
            {
                categoryName: "Drafting",
                description: "Drafting games require players to take collectible items form a defined collection, to achive win condition",
            }
        ]
    })

    await prisma.products.createMany({
        data: [
            {
                productName: "Ultimate Werewolf Extreme",
                price: 265000,
                stockQuantity: 10,
                description: "A role playing game where players join the combat between villagers and mystery creature",
                minPlayer: 5,
                maxPlayer: 70,
                duration: 20,
                categoryId: 2,
                imageUrl: "https://cf.geekdo-images.com/GH3EEJAY-dqzUW9szzlTQQ__itemrep/img/whBAKXIf41GDVa1jRBegikP3MfM=/fit-in/246x300/filters:strip_icc()/pic5478856.png",
            },
            {
                productName: "Splendor",
                price: 128000,
                stockQuantity: 10,
                description: "Players are given a chance to trade valuable as an merchant to become the most wealthy person",
                minPlayer: 2,
                maxPlayer: 4,
                duration: 25,
                categoryId: 4,
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3xK5AwelvM4UwjWOrzgjeHcwla2jSSYsIDg&s",
            },
            {
                productName: "Monopoly",
                price: 156000,
                stockQuantity: 10,
                description: "An economics-themed board game where players buy property and collect others's rent to become a billionaire",
                minPlayer: 2,
                maxPlayer: 4,
                duration: 90,
                categoryId: 3,
                imageUrl: "https://cf.geekdo-images.com/9nGoBZ0MRbi6rdH47sj2Qg__opengraph/img/Dm8scRK_5hJrDrv8OPyDHP1WVf8=/0x0:1307x686/fit-in/1200x630/filters:strip_icc()/pic5786795.jpg",
            },

        ]
    })
}

main().catch((error) => {
    console.log(error);
})