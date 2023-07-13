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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var fs = require("fs");
var dotenv = require("dotenv");
dotenv.config();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
var s3 = new AWS.S3();
var bucketName = "martina-bucket";
var readFromBucket = function () { return __awaiter(void 0, void 0, void 0, function () {
    var listObjectsParams, response, files, _i, files_1, file, fileKey, extension, getObjectParams, Body, fileContent, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                listObjectsParams = {
                    Bucket: bucketName,
                };
                return [4 /*yield*/, s3.listObjectsV2(listObjectsParams).promise()];
            case 1:
                response = _b.sent();
                files = response.Contents;
                if (!files) return [3 /*break*/, 6];
                _i = 0, files_1 = files;
                _b.label = 2;
            case 2:
                if (!(_i < files_1.length)) return [3 /*break*/, 6];
                file = files_1[_i];
                fileKey = (_a = file.Key) !== null && _a !== void 0 ? _a : "";
                extension = fileKey.split(".")[1];
                getObjectParams = {
                    Bucket: bucketName,
                    Key: fileKey,
                };
                if (!(extension === "txt" || extension === "pdf")) return [3 /*break*/, 4];
                return [4 /*yield*/, s3.getObject(getObjectParams).promise()];
            case 3:
                Body = (_b.sent()).Body;
                if (Body) {
                    fileContent = Body.toString("utf-8");
                    console.log("File:");
                    console.log(fileKey);
                    console.log("File content:");
                    console.log(fileContent);
                }
                return [3 /*break*/, 5];
            case 4:
                console.log("File:");
                console.log(fileKey);
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6:
                console.log("Files read successfully");
                return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                console.error("Error", error_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var insertFileInBucket = function (fileKey, filePath, contentType) { return __awaiter(void 0, void 0, void 0, function () {
    var fileData, putObjectParams, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, readFile(filePath)];
            case 1:
                fileData = _a.sent();
                putObjectParams = {
                    Bucket: bucketName,
                    Key: fileKey,
                    Body: fileData,
                    ContentType: contentType,
                };
                return [4 /*yield*/, s3.putObject(putObjectParams).promise()];
            case 2:
                _a.sent();
                console.log("File uploaded to S3 bucket: ".concat(fileKey));
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error: ", error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var readFile = function (filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var fileKey, filePath, fileContentType, imageKey, imagePath, imageContentType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readFromBucket()];
            case 1:
                _a.sent();
                fileKey = "file3.txt";
                filePath = "file3.txt";
                fileContentType = "text/plain";
                imageKey = "image.png";
                imagePath = "image.png";
                imageContentType = "image/png";
                return [4 /*yield*/, insertFileInBucket(fileKey, filePath, fileContentType)];
            case 2:
                _a.sent();
                return [4 /*yield*/, insertFileInBucket(imageKey, imagePath, imageContentType)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
