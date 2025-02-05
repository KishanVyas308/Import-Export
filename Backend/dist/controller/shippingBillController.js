"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.part1section1 = part1section1;
exports.part1section2 = part1section2;
exports.part1section3 = part1section3;
exports.part2section1 = part2section1;
exports.part2section2 = part2section2;
exports.part2section3 = part2section3;
exports.part3section1 = part3section1;
exports.part3section2 = part3section2;
exports.part3section3 = part3section3;
exports.part4section1 = part4section1;
exports.part4section2 = part4section2;
exports.part4section3 = part4section3;
exports.part4section4 = part4section4;
exports.part4section5 = part4section5;
exports.part4section6 = part4section6;
exports.part5 = part5;
const __1 = require("..");
function part1section1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 1 section 1 is completed
            if (shippingBill.isPart1Section1Completed) {
                return res.json({ message: "This part is aleard added" });
            }
            // add part 1 section 1
            const upload = yield __1.prisma.part1Section1.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    currentExportersName: data.exportersName,
                    isPart1Section1Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part1section2(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 1 section 2 is completed
            if (shippingBill.isPart1Section2Completed) {
                return res.json({ message: "This part is aleard added" });
            }
            // add part 1 section 2
            const upload = yield __1.prisma.part1Section2.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart1Section2Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part1section3(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 1 section 3 is completed
            if (shippingBill.isPart1Section3Completed) {
                return res.json({ message: "This part is aleard added" });
            }
            // add part 1 section 3
            const upload = yield __1.prisma.part1Section3.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart1Section3Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part2section1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 2 section 1 is completed
            if (shippingBill.isPart2Section1Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 2 section 1
            const upload = yield __1.prisma.part2Section1.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart2Section1Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part2section2(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 2 section 2 is completed
            if (shippingBill.isPart2Section2Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 2 section 2
            const upload = yield __1.prisma.part2Section2.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart2Section2Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part2section3(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 2 section 3 is completed
            if (shippingBill.isPart2Section3Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 2 section 3
            const upload = yield __1.prisma.part2Section3.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart2Section3Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part3section1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 3 section 1 is completed
            if (shippingBill.isPart3Section1Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 3 section 1
            const upload = yield __1.prisma.part3Section1.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart3Section1Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part3section2(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 3 section 2 is completed
            if (shippingBill.isPart3Section2Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 3 section 2
            const upload = yield __1.prisma.part3Section2.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart3Section2Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part3section3(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 3 section 3 is completed
            if (shippingBill.isPart3Section3Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 3 section 3
            const upload = yield __1.prisma.part3Section3.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart3Section3Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part4section1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 4 section 1 is completed
            if (shippingBill.isPart4Section1Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 4 section 1
            const upload = yield __1.prisma.part4Section1.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart4Section1Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part4section2(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 4 section 2 is completed
            if (shippingBill.isPart4Section2Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 4 section 2
            const upload = yield __1.prisma.part4Section2.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart4Section2Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part4section3(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 4 section 3 is completed
            if (shippingBill.isPart4Section3Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 4 section 3
            const upload = yield __1.prisma.part4Section3.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart4Section3Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part4section4(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 4 section 4 is completed
            if (shippingBill.isPart4Section4Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 4 section 4
            const upload = yield __1.prisma.part4Section4.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart4Section4Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part4section5(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 4 section 5 is completed
            if (shippingBill.isPart4Section5Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 4 section 5
            const upload = yield __1.prisma.part4Section5.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart4Section5Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part4section6(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 4 section 6 is completed
            if (shippingBill.isPart4Section6Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 4 section 6
            const upload = yield __1.prisma.part4Section6.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart4Section6Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
function part5(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            // check if current sheet is completed
            const shippingBill = yield checkIsCurrentSheetIsCompleted(data.addedByUserId);
            if (!shippingBill)
                return res.json({ message: "User not found" });
            // check if part 5 is completed
            if (shippingBill.isPart5Completed) {
                return res.json({ message: "This part is already added" });
            }
            // add part 5
            const upload = yield __1.prisma.part5.create({
                data: data,
            });
            const updateManageUserShippingBill = yield __1.prisma.manageUserShippingBill.update({
                where: {
                    id: shippingBill === null || shippingBill === void 0 ? void 0 : shippingBill.id,
                },
                data: {
                    isPart5Completed: true,
                },
            });
            return res.json({ message: "Data imported successfully" });
        }
        catch (error) {
            console.error("Error importing data:", error);
            return res.json({ message: "Error importing data" });
        }
    });
}
// fetch user
// fetch current shipping bill
// check if current shipping bill is completed
// if completed create new shipping bill
// update current user shipping bill id
function checkIsCurrentSheetIsCompleted(addedByUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        // fetch current user from its id
        const user = yield __1.prisma.user.findUnique({
            where: {
                id: addedByUserId,
            },
        });
        if (!user) {
            return null;
        }
        if (!user.currentShippingBillId) {
            const newShippingBill = yield __1.prisma.manageUserShippingBill.create({
                data: {
                    user: {
                        connect: { id: user.id },
                    },
                },
            });
            // update current user shipping bill id
            const updatedUser = yield __1.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    currentShippingBillId: newShippingBill.id,
                },
            });
            return newShippingBill;
        }
        const manageUserShippingBill = yield __1.prisma.manageUserShippingBill.findUnique({
            where: {
                id: user.currentShippingBillId,
            },
        });
        if (manageUserShippingBill) {
            if (manageUserShippingBill.isPart1Section1Completed &&
                manageUserShippingBill.isPart1Section2Completed &&
                manageUserShippingBill.isPart1Section3Completed &&
                manageUserShippingBill.isPart2Section1Completed &&
                manageUserShippingBill.isPart2Section2Completed &&
                manageUserShippingBill.isPart2Section3Completed &&
                manageUserShippingBill.isPart3Section1Completed &&
                manageUserShippingBill.isPart3Section2Completed &&
                manageUserShippingBill.isPart3Section3Completed &&
                manageUserShippingBill.isPart4Section1Completed &&
                manageUserShippingBill.isPart4Section2Completed &&
                manageUserShippingBill.isPart4Section3Completed &&
                manageUserShippingBill.isPart4Section4Completed &&
                manageUserShippingBill.isPart4Section5Completed &&
                manageUserShippingBill.isPart4Section6Completed &&
                manageUserShippingBill.isPart5Completed) {
                yield __1.prisma.manageUserShippingBill.update({
                    where: {
                        id: manageUserShippingBill.id,
                    },
                    data: {
                        isCompleted: true,
                    },
                });
                const newShippingBill = yield __1.prisma.manageUserShippingBill.create({
                    data: {
                        user: {
                            connect: { id: user.id },
                        },
                    },
                });
                // update current user shipping bill id
                yield __1.prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        currentShippingBillId: newShippingBill.id,
                    },
                });
                return newShippingBill;
            }
        }
        return manageUserShippingBill;
    });
}
