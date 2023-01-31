"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.Prisma = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
exports["default"] = prisma;
var client_2 = require("@prisma/client");
__createBinding(exports, client_2, "Prisma");
//# sourceMappingURL=index.js.map