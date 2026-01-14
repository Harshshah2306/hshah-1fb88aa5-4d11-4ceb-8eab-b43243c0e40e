/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(5);
const auth_1 = __webpack_require__(6); // Import from your lib
const users_module_1 = __webpack_require__(20);
const app_controller_1 = __webpack_require__(25);
const app_service_1 = __webpack_require__(26);
const user_entity_1 = __webpack_require__(14);
const auth_controller_1 = __webpack_require__(27);
const tasks_module_1 = __webpack_require__(28);
const task_entity_1 = __webpack_require__(17);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'db.sqlite',
                entities: [user_entity_1.User, task_entity_1.Task], // Explicitly list entities if autoLoad fails
                synchronize: true,
            }),
            users_module_1.UsersModule,
            auth_1.AuthModule,
            tasks_module_1.TasksModule,
        ],
        controllers: [app_controller_1.AppController, auth_controller_1.AuthController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(7), exports);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(8);
const passport_1 = __webpack_require__(9);
const auth_service_1 = __webpack_require__(10);
const jwt_strategy_1 = __webpack_require__(18);
const users_module_1 = __webpack_require__(20); // Import UsersModule
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule, // Allows AuthService to use UsersService
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'YOUR_SECRET_KEY', // Must match the key in JwtStrategy
                signOptions: { expiresIn: '1h' }, // Token expires in 1 hour
            }),
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService], // Export AuthService so the API can use it
    })
], AuthModule);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(8);
const bcrypt = tslib_1.__importStar(__webpack_require__(11));
// Check these import paths match your project structure
const users_service_1 = __webpack_require__(12);
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    // 1. Validate User (Used by LocalStrategy)
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        // Check if user exists AND if password matches the hash
        if (user && (await bcrypt.compare(pass, user.password))) {
            // Strip the password before returning the user object
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    // 2. Login (Generates JWT Token)
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
            user: user,
        };
    }
    // 3. Register (Creates New User)
    async register(userDto) {
        // A. Generate a safe "salt"
        const salt = await bcrypt.genSalt();
        // B. Hash the password using that salt
        const hashedPassword = await bcrypt.hash(userDto.password, salt);
        // C. Create the user in the database
        const rawResult = await this.usersService.create({
            ...userDto,
            password: hashedPassword,
        });
        // --- FIX FOR YOUR ERROR STARTS HERE ---
        // If the database returns an array (User[]), we grab the first item.
        // If it returns a single object, we use it directly.
        const newUser = Array.isArray(rawResult) ? rawResult[0] : rawResult;
        // --- FIX ENDS HERE ---
        // D. Return the user info without the password
        const { password, ...result } = newUser;
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(5);
const typeorm_2 = __webpack_require__(13);
const user_entity_1 = __webpack_require__(14);
;
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        // We will hash the password in the Controller or Service before saving
        const newUser = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(newUser);
    }
    findAll() {
        return this.usersRepository.find({
            // We select only specific fields to avoid sending the password
            select: ['id', 'email', 'role', 'organizationId']
        });
    }
    findOne(id) {
        return `This action returns a #${id} user`;
    }
    update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
    findByEmail(email) {
        return this.usersRepository.findOneBy({ email });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], UsersService);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const tslib_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(13);
// Replace the import below with your actual library name found in tsconfig.base.json
// It usually looks like @<workspace-name>/data
const data_1 = __webpack_require__(15);
const task_entity_1 = __webpack_require__(17);
let User = class User {
};
exports.User = User;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], User.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "password", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: data_1.UserRole,
        default: data_1.UserRole.VIEWER
    }),
    tslib_1.__metadata("design:type", typeof (_a = typeof data_1.UserRole !== "undefined" && data_1.UserRole) === "function" ? _a : Object)
], User.prototype, "role", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, (task) => task.user),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "tasks", void 0);
exports.User = User = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], User);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(16), exports);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["OWNER"] = "OWNER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["VIEWER"] = "VIEWER";
})(UserRole || (exports.UserRole = UserRole = {}));
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Task = void 0;
const tslib_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(13);
const user_entity_1 = __webpack_require__(14);
let Task = class Task {
};
exports.Task = Task;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Task.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: 'OPEN' }) // OPEN, IN_PROGRESS, DONE
    ,
    tslib_1.__metadata("design:type", String)
], Task.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.tasks),
    tslib_1.__metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Task.prototype, "user", void 0);
exports.Task = Task = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], Task);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(9);
const passport_jwt_1 = __webpack_require__(19);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'YOUR_SECRET_KEY', // ⚠️ In a real app, use process.env.JWT_SECRET
        });
    }
    async validate(payload) {
        // This payload is the decoded JWT. We return what we want available in Request.user
        return { id: payload.sub, username: payload.username, role: payload.role };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], JwtStrategy);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(5);
const users_service_1 = __webpack_require__(12);
const users_controller_1 = __webpack_require__(21);
const user_entity_1 = __webpack_require__(14);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]) // <-- Register the User entity here!
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const users_service_1 = __webpack_require__(12);
const create_user_dto_1 = __webpack_require__(22);
const update_user_dto_1 = __webpack_require__(23);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll() {
        return this.usersService.findAll();
    }
    findOne(id) {
        return this.usersService.findOne(+id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(+id);
    }
};
exports.UsersController = UsersController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = tslib_1.__decorate([
    (0, common_1.Controller)('users'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const mapped_types_1 = __webpack_require__(24);
const create_user_dto_1 = __webpack_require__(22);
class UpdateUserDto extends (0, mapped_types_1.PartialType)(create_user_dto_1.CreateUserDto) {
}
exports.UpdateUserDto = UpdateUserDto;


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(26);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(10); // Import Auth Service
const data_1 = __webpack_require__(15);
let AppService = class AppService {
    constructor(authService) {
        this.authService = authService;
    }
    async onApplicationBootstrap() {
        // 1. Check if our test user exists by trying to validate them
        const user = await this.authService.validateUser('test@example.com', 'password123');
        // 2. If no user found, create one!
        if (!user) {
            console.log('🌱 Seeding database with default user...');
            try {
                await this.authService.register({
                    email: 'test@example.com',
                    password: 'password123',
                    organizationId: 'org-default',
                    role: data_1.UserRole.OWNER
                });
                console.log('✅ User created! Email: test@example.com | Password: password123');
            }
            catch (e) {
                // If register fails (e.g. user already exists but password differs), just ignore
                console.log('ℹ️ User might already exist.');
            }
        }
    }
    getData() {
        return { message: 'Hello API' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AppService);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(10);
const data_1 = __webpack_require__(15);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.logger = new common_1.Logger('AuthController');
    }
    async login(body) {
        // 1. Log what we received (This helps us debug!)
        this.logger.log(`Attempting login...`);
        this.logger.log(`Body received: ${JSON.stringify(body)}`);
        // 2. Safety Check: Is the body missing?
        if (!body) {
            this.logger.error('❌ Error: The Request Body is undefined.');
            throw new common_1.UnauthorizedException('Request body is missing');
        }
        // 3. Safety Check: Is the email missing?
        if (!body.email || !body.password) {
            this.logger.error('❌ Error: Email or Password missing in body.');
            throw new common_1.UnauthorizedException('Email and Password are required');
        }
        // 4. Validate the user
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            this.logger.warn(`❌ Login failed for email: ${body.email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        // 5. Success
        this.logger.log(`✅ Login successful for: ${body.email}`);
        return this.authService.login(user);
    }
    async register(body) {
        return this.authService.register(body);
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof data_1.CreateUserDto !== "undefined" && data_1.CreateUserDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(5);
const tasks_service_1 = __webpack_require__(29);
const tasks_controller_1 = __webpack_require__(30);
const task_entity_1 = __webpack_require__(17);
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task])], // 👈 Registers the Entity
        controllers: [tasks_controller_1.TasksController],
        providers: [tasks_service_1.TasksService],
    })
], TasksModule);


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(5);
const typeorm_2 = __webpack_require__(13);
const task_entity_1 = __webpack_require__(17);
let TasksService = class TasksService {
    constructor(tasksRepository) {
        this.tasksRepository = tasksRepository;
    }
    // Create a task for the specific user
    async create(createTaskDto, user) {
        const newTask = this.tasksRepository.create({
            ...createTaskDto,
            // 👇 NOW this works because user.id is valid
            user: { id: user.id }
        });
        return this.tasksRepository.save(newTask);
    }
    // Get only the tasks for the specific user
    async findAll(user) {
        return this.tasksRepository.find({
            // where: { user: { id: user.id } }, // ❌ DELETE or COMMENT OUT this line
            relations: ['user'], // Optional: shows who created the task
            order: { id: 'DESC' }
        });
    }
    // Update status (for drag and drop)
    async update(id, updateTaskDto) {
        // 👇 1. ADD THIS SAFETY BLOCK
        // If the data is empty or undefined, don't touch the database.
        if (!updateTaskDto || Object.keys(updateTaskDto).length === 0) {
            console.log('Update skipped: No data provided');
            return { message: 'No changes made' };
        }
        // 👇 2. Proceed with update only if we have data
        await this.tasksRepository.update(id, updateTaskDto);
        return this.tasksRepository.findOne({ where: { id } });
    }
    async remove(id) {
        return this.tasksRepository.delete(id);
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], TasksService);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const tasks_service_1 = __webpack_require__(29);
const jwt_auth_guard_1 = __webpack_require__(31); // Ensure you have this guard
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    create(req, createTaskDto) {
        if (req.user.role === 'VIEWER') {
            throw new common_1.ForbiddenException('Viewers are not allowed to create tasks.');
        }
        // req.user is added by the AuthGuard
        return this.tasksService.create(createTaskDto, req.user);
    }
    findAll(req) {
        return this.tasksService.findAll(req.user);
    }
    update(id, updateTaskDto) {
        return this.tasksService.update(+id, updateTaskDto);
    }
    remove(id, req) {
        // 👇 SECURITY CHECK
        if (req.user.role === 'VIEWER') {
            throw new common_1.ForbiddenException('Viewers are not allowed to delete tasks.');
        }
        return this.tasksService.remove(+id); // (Or this.tasksService.delete(id))
    }
};
exports.TasksController = TasksController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TasksController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = tslib_1.__decorate([
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // 👈 Protects routes so only logged-in users can access
    ,
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof tasks_service_1.TasksService !== "undefined" && tasks_service_1.TasksService) === "function" ? _a : Object])
], TasksController);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(9);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    app.enableCors({
        origin: 'http://localhost:4200', // Allow your Angular Frontend
        credentials: true,
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map